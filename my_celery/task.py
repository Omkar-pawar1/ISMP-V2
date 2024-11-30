from celery import shared_task
import time

import flask_excel
from models import Campaign,Influencer, Ad_request,Sponsor
from my_celery.mail_service import send_email

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y
    

@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = Campaign.query.filter_by(id=1).all()

    task_id = self.request.id
    filename = f'blog_data_{task_id}.csv'
    column_names = [column.name for column in Campaign.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./my_celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_result = True)
def email_reminder(to, subject, content):
    send_email(to, subject, content)

@shared_task(ignore_result=True)
def send_daily_reminders():
    influencers = Influencer.query.all()
    for influencer in influencers:
        pending_requests = Ad_request.query.filter_by(
            influencer_id=influencer.id,
            status='Pending'
        ).all()

        if pending_requests:
            email = influencer._user.email
            content = f"""
            <h1>Daily Reminder</h1>
            <p>Dear {influencer.name},</p>
            <p>You have pending ad requests. Please log in to review them:</p>
            """
            email_reminder(to=influencer.name, subject="Daily Reminder", content=content)

@shared_task(ignore_result=True)
def generate_monthly_reports():
    sponsors = Sponsor.query.all()

    for sponsor in sponsors:
        email = sponsor._user.email
        campaigns = Campaign.query.filter_by(sponsor_id=sponsor.sponsor_id).all()
        report_content = f"""
        <h1>Monthly Activity Report</h1>
        <p>Dear {sponsor.name},</p>
        <p>Here is the summary of your campaigns:</p>
        """
        for campaign in campaigns:
            report_content += f"""
            <h2>{campaign.name}</h2>
            <p>Description: {campaign.description}</p>
            <p>Budget Used: {campaign.budget}</p>
            <p>Goals: {campaign.goals}</p>
            """

        email_reminder(
            to="sponsor.name",
            subject="Monthly Activity Report",
            content=report_content
        )