from celery.schedules import crontab
from app import celery_app
from my_celery.task import email_reminder,send_daily_reminders,generate_monthly_reports

# celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(10.0,test.s('hello celery'))
    # every 10 seconds
    sender.add_periodic_task(10.0, email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>') )

    # daily message at 6:55 pm, everyday
    # sender.add_periodic_task(crontab(hour=18, minute=55), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name='daily reminder' )

    # weekly messages
    # sender.add_periodic_task(crontab(hour=18, minute=55, day_of_week='monday'), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name = 'weekly reminder' )


@celery_app.task
def test(arg):
    print(arg)

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Daily reminders at 6:00 PM
    sender.add_periodic_task(
        crontab(hour=17, minute=55),
        send_daily_reminders.s(),
        name='daily_reminders'
    )

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Monthly report on the first day of the month
    sender.add_periodic_task(
        10.0,
        generate_monthly_reports.s(),
        name='monthly_reports'
    )