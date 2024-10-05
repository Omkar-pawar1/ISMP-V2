from flask_security.models import fsqla_v3 as fsqla
from database import db

fsqla.FsModels.set_db_info(db)


class Role(db.Model, fsqla.FsRoleMixin):
    pass

class User(db.Model, fsqla.FsUserMixin):
    pass

class Influencer(db.Model):
    __tablename__="influencer"
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    influencer_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    name=db.Column(db.String(225))
    reach = db.Column(db.Integer)
    balance_amount=db.Column(db.Float,default=0.0) 
    platform=db.Column(db.String())
    category = db.Column(db.String(255),nullable=False)
    niche = db.Column(db.String(255),nullable=False)
    ads=db.relationship('Ad_request',backref='influencer', lazy=True, cascade="all, delete-orphan")

class Sponsor(db.Model):
    __tablename__="sponsor"
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    name = db.Column(db.String(255))
    industry = db.Column(db.String(255))
    sponsor_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    campaigns=db.relationship('Campaign',backref='sponsor',lazy=True, cascade="all, delete-orphan")
    ads=db.relationship('Ad_request',backref='sponsor', lazy=True, cascade="all, delete-orphan")

class Campaign(db.Model):
    __tablename__="campaign"
    id=db.Column(db.Integer,autoincrement=True,primary_key=True)
    name=db.Column(db.String())
    description=db.Column(db.Text)
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)
    budget=db.Column(db.Integer)
    visibility=db.Column(db.String())
    goals=db.Column(db.Text)
    category=db.Column(db.String())
    sponsor_id=db.Column(db.Integer,db.ForeignKey('sponsor.sponsor_id'),nullable=False)
    ad=db.relationship('Ad_request',backref='campaign',lazy=True, cascade="all, delete-orphan")

class Ad_request(db.Model):
    __tablename__="ad_request"
    id=db.Column(db.Integer,autoincrement=True,primary_key=True)
    campaign_id=db.Column(db.Integer,db.ForeignKey('campaign.id'),nullable=False)
    influencer_id=db.Column(db.Integer,db.ForeignKey('influencer.influencer_id'),nullable=False)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('sponsor.sponsor_id'), nullable=False)
    description=db.Column(db.Text)
    requirement=db.Column(db.Text)
    payment_amount=db.Column(db.Float)
    status=db.Column(db.String(225))

