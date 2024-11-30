import os

from flask import Flask,render_template,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore,roles_required,auth_required, hash_password,verify_password,auth_required,current_user
from database import db
from models import User,Role

from resources.getusers import getuser
from resources.register import Register
from resources.admin import New_sponsors
from resources.sponsor import CreateCampaign

from my_celery.celery_factory import celery_init_app

from flask_cors import CORS 
from flask_caching import Cache

from flask_restful import  Api # type: ignore

# Create app
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['DEBUG'] = True

app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')


# Use an in-memory db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mylms.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
app.config['SECURITY_TOKEN_MAX_AGE'] = 3600 #1hr 
app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True
app.config['SECURITY_TOKEN_AUTHENTICATION_KEY']= 'token'
app.config["SECURITY_TOKEN_AUTHENTICATION_BACKENDS"] = ["token"]
WTF_CSRF_ENABLED = False
CACHE_TYPE= 'RedisCache'
CACHE_DEFAULT_TIMEOUT= 30
CACHE_REDIS_PORT= 6379


# Create database connection object
db.init_app(app)
cache=Cache(app)


user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# one time setup
with app.app_context():
    db.create_all()

    #creating roles
    admin_role=user_datastore.find_or_create_role(name='admin', description = "Administrator")
    sponsors_role =user_datastore.find_or_create_role(name='sponsor', description = "Sponsor")
    influencers_role =user_datastore.find_or_create_role(name='influencer', description = "Influencer")
    db.session.commit()
    
    # Create User to test with

    if not user_datastore.find_user(email = "admin@iitm.ac.in"):
        user_datastore.create_user(email = "admin@iitm.ac.in", password = hash_password("pass"), roles=[admin_role])
    if not user_datastore.find_user(email = "spon@iitm.ac.in"):
        user_datastore.create_user(email = "spon@iitm.ac.in", password = hash_password("pass"), roles=[sponsors_role])
    if not user_datastore.find_user(email = "inf@iitm.ac.in"):
        user_datastore.create_user(email = "inf@iitm.ac.in", password = hash_password("pass"), roles=[influencers_role])

    db.session.commit()

app.config["WTF_CSRF_CHECK_DEFAULT"] = False
app.config['SECURITY_CSRF_PROTECT_MECHANISMS'] = []
app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True



api = Api(app)
app.cache=cache

celery_app=celery_init_app(app)

api.add_resource(getuser, '/users')
api.add_resource(Register, '/register')
api.add_resource(New_sponsors,'/new_sponsors')
# api.add_resource(CreateCampaign,'/create_campaign')


# Views
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/user-login', methods=['POST'])
def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message' : 'email or password not provided'}), 400
        
        user = user_datastore.find_user(email = email)

        if not user:
            return jsonify({'message' : 'invalid user'}), 400
        
        if verify_password(password, user.password):
            print('token:' , user.get_auth_token())
            return jsonify({'token' : user.get_auth_token(), 'user' : user.email, 'role' : user.roles[0].name,'active' : user.active}), 200
        else :
            return jsonify({'message' : 'invalid password'}), 400

@roles_required('admin')
@auth_required('token')
@app.route('/inactive_sponsors', methods=['GET'])
def get_inactive_instructors():
        
        # Query for all users
        all_users = user_datastore.user_model().query.all()
        
        # Filter users to get only inactive instructors
        inactive_sponsors = [
            user for user in all_users 
            if not user.active and any(role.name == 'sponsor' for role in user.roles)
        ]
        
        # Prepare the response data
        results = [
            {
                'id': user.id,
                'email': user.email,
            }
            for user in inactive_sponsors
        ]
        
        return jsonify(results), 200


@auth_required('token')
@app.route('/my_campaigns', methods=['GET'])
def my_campaigns():
    from models import Campaign
    email = request.args.get('email')
    user = user_datastore.find_user(email = email)
    campaigns=Campaign.query.filter_by(sponsor_id=user.id).all()
    campaigns_list = [
            {
                "id": campaign.id,
                "name": campaign.name,
                "start_date": campaign.start_date,
                "end_date": campaign.end_date,
                "description": campaign.description,
                "ad_requests": [
            {
                "id": ad.id,
                "influencer_id": ad.influencer_id,
                "sponsor_id": ad.sponsor_id,
                "description": ad.description,
                "requirement": ad.requirement,
                "payment_amount": ad.payment_amount,
                "status": ad.status,
            }
            for ad in campaign.ad
        ],
            }
            for campaign in campaigns
        ]
    return jsonify(campaigns_list), 200

     
     
     

from sqlalchemy.exc import SQLAlchemyError

@roles_required('admin')
@auth_required('token')
@app.route('/create_campaign',methods=['POST'])
def create_campaign():
        token = request.headers.get("AuthenticationToken")
        print("Is authenticated:", current_user.is_authenticated)
        print("token in create campaign :" ,token)
        from flask_restful import  reqparse
        from models import Campaign  # Import inside to prevent circular dependencies
        from datetime import datetime

        parser = reqparse.RequestParser()
        parser.add_argument('email')
        parser.add_argument('name', required=True, help="Campaign name is required.")
        parser.add_argument('description', required=True, help="Campaign description is required.")
        parser.add_argument('start_date', required=True, help="Start date is required.")
        parser.add_argument('end_date', required=True, help="End date is required.")
        parser.add_argument('budget', type=int, required=True, help="Budget must be a number.")
        parser.add_argument('visibility', choices=('Public', 'Private'), required=True, help="Visibility must be Public or Private.")
        parser.add_argument('goal', required=True, help="Goals are required.")
        parser.add_argument('category', required=True, help="Category is required.")

        
        args = parser.parse_args()
        print(args)
        email=args['email']
        user = user_datastore.find_user(email = email)
        try:
            # Create a new campaign
            campaign = Campaign(
                name=args['name'],
                description=args['description'],
                start_date = datetime.strptime(args['start_date'], '%Y-%m-%d').date(),
                end_date = datetime.strptime(args['end_date'], '%Y-%m-%d').date(),
                visibility=args['visibility'],
                budget=args['budget'],
                goals=args['goal'],
                category=args['category'],
                sponsor_id=user.id
            )
            
            # Add to the database
            db.session.add(campaign)
            db.session.commit()

            # Return success response
            print("in try and after commit")
            return {"message": "Campaign created successfully", "campaign_id": campaign.id}, 201
        
        except SQLAlchemyError as e:
            db.session.rollback()
            print("in sqlalchemy exception details of error",str(e))
            return {"error": "Failed to create campaign", "details": str(e)}, 500
        
        except Exception as e:
            print("in just  exception details of error",str(e))

            return {"error": "An unexpected error occurred", "details": str(e)}, 500


@auth_required('token')
@app.route('/edit_campaign/<int:id>',methods=['PUT'])
def edit_campaign(id):
        token = request.headers.get("AuthenticationToken")
        print("Is authenticated:", current_user.is_authenticated)
        print("token in create campaign :" ,token)
        from flask_restful import  reqparse
        from models import Campaign  # Import inside to prevent circular dependencies
        from datetime import datetime

        parser = reqparse.RequestParser()
        parser.add_argument('email')
        parser.add_argument('name', required=True, help="Campaign name is required.")
        parser.add_argument('description', required=True, help="Campaign description is required.")
        parser.add_argument('start_date', required=True, help="Start date is required.")
        parser.add_argument('end_date', required=True, help="End date is required.")
        parser.add_argument('budget', type=int, required=True, help="Budget must be a number.")
        parser.add_argument('visibility', choices=('Public', 'Private'), required=True, help="Visibility must be Public or Private.")
        parser.add_argument('goal', required=True, help="Goals are required.")
        parser.add_argument('category', required=True, help="Category is required.")

        
        args = parser.parse_args()
        print(args)
        email=args['email']
        user = user_datastore.find_user(email = email)
        campaign=Campaign.query.filter_by(id=id).first()
        try:
            campaign.name=args['name']
            campaign.description=args['description']
            campaign.start_date = datetime.strptime(args['start_date'], '%Y-%m-%d').date()
            campaign.end_date = datetime.strptime(args['end_date'], '%Y-%m-%d').date()
            campaign.visibility=args['visibility']
            campaign.budget=args['budget']
            campaign.goals=args['goal']
            campaign.category=args['category']
            campaign.sponsor_id=user.id
                        
            # Add to the database
            db.session.commit()

            # Return success response
            print("in try and after commit")
            return {"message": "Campaign created successfully", "campaign_id": campaign.id}, 201
        
        except SQLAlchemyError as e:
            db.session.rollback()
            print("in sqlalchemy exception details of error",str(e))
            return {"error": "Failed to create campaign", "details": str(e)}, 500
        
        except Exception as e:
            print("in just  exception details of error",str(e))

            return {"error": "An unexpected error occurred", "details": str(e)}, 500
@app.route('/delete_campaign/<int:id>',methods=['DELETE'])
def delete_campaign(id):
    from models import Campaign
    campaign=Campaign.query.filter_by(id=id).first()
    if not campaign:
         return {"error": "Campaign not found"},404

    db.session.delete(campaign)
    db.session.commit()
    return {"message": "Campaign deleted successfully", "campaign_name": campaign.name}, 201

@app.route('/searchInfluencer',methods=['GET'])
def searchInfluencer():   
    from models import Influencer
    category = request.args.get("category")
    niche = request.args.get("niche")

    influencers=Influencer.query.filter_by(category=category,niche=niche).all()
    influencer_list= [
        {
             "name":influencer.name,
             "reach":influencer.reach
        }
        for influencer in influencers   
    ]
    if not influencer_list:
        return {"error":"No influencer present in this niche"}
    else:
        return jsonify(influencer_list), 200

@app.route('/setinfProfile',methods=['POST'])
def setinfProfile():
    from models import Influencer
    from flask_restful import reqparse
    parser=reqparse.RequestParser()
    parser.add_argument('email')
    parser.add_argument('name')
    parser.add_argument('platform')
    parser.add_argument('reach')
    parser.add_argument('category')
    parser.add_argument('niche')
    args=parser.parse_args()
    user = user_datastore.find_user(email = args['email'])
    try:
        influencer=Influencer(
            influencer_id=user.id,
            name=args['name'],
            reach=args['reach'],
            platform=args['platform'],
            category=args['category'],
            niche=args['niche']
        )
        db.session.add(influencer)
        db.session.commit()
        return {"message": "seved successfully", "influencer_id": influencer.id}, 201
    except SQLAlchemyError as e:
            db.session.rollback()
            print("in sqlalchemy exception details of error",str(e))
            return {"error": "Failed to save", "details": str(e)}, 500
        
    except Exception as e:
        print("in just  exception details of error",str(e))

        return {"error": "An unexpected error occurred", "details": str(e)}, 500

@app.route('/make_ad_request/<int:id>',methods=['POST'])
def make_ad_request(id):
    from models import Ad_request,Influencer
    from flask_restful import reqparse
    parser=reqparse.RequestParser()
    parser.add_argument('description')
    parser.add_argument('requirement')
    parser.add_argument('payment_amount')
    parser.add_argument('status')
    parser.add_argument('influencer')
    parser.add_argument('sponsor')
    args=parser.parse_args()
    print("args[influencer]",args['influencer'])
    influencer=Influencer.query.filter_by(name=args['influencer']).first()
    sponsor=user_datastore.find_user(email = args['sponsor'])
    ad_request=Ad_request(
        campaign_id=id,
        influencer_id=influencer.influencer_id,
        sponsor_id=sponsor.id,
        description=args['description'],
        requirement=args['requirement'],
        payment_amount=args['payment_amount'],
        status=args['status']   
    )
    db.session.add(ad_request)
    db.session.commit()
    return{"message":"Created successfully"},201
     
     
@app.route('/edit_ad_request/<int:id>',methods=['PUT'])
def edit_ad_request(id):
    from models import Ad_request,Influencer
    from flask_restful import reqparse
    parser=reqparse.RequestParser()
    parser.add_argument('description')
    parser.add_argument('requirement')
    parser.add_argument('payment_amount')
    parser.add_argument('status')
    parser.add_argument('influencer')
    parser.add_argument('sponsor')
    args=parser.parse_args()
    print("args[influencer]",args['influencer'])
    influencer=Influencer.query.filter_by(name=args['influencer']).first()
    sponsor=user_datastore.find_user(email = args['sponsor'])
    ad_request=Ad_request.query.filter_by(id=id).first()
    if(ad_request.influencer_id == influencer.influencer_id):
        ad_request.description=args['description']
        ad_request.requirement=args['requirement']
        ad_request.payment_amount=args['payment_amount']
        ad_request.status='edited'
        db.session.commit()
        return{"message":"Edited successfully"}
    else:
        db.session.delete(ad_request)
        new_ad_request=Ad_request(
            campaign_id=id,
            influencer_id=influencer.influencer_id,
            sponsor_id=sponsor.id,
            description=args['description'],
            requirement=args['requirement'],
            payment_amount=args['payment_amount'],
            status=args['status']   
        )
        db.session.add(new_ad_request)
        db.session.commit()
        return{"message":"Created successfully"},201

@app.route('/delete_ad/<int:id>',methods=['DELETE'])    
def delete_ad(id):
    from models import Ad_request
    try:
        ad=Ad_request.query.filter_by(id=id).first()
        db.session.delete(ad)
        db.session.commit()
        
        return {"message":"Deleted Successfully"}
    except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": "Failed to delete", "details": str(e)}, 500
        
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}, 500

@app.route('/influencer_adRequest',methods=['GET'])
def influencer_adRequest():
    from models import Influencer,Ad_request
    email = request.args.get('email')
    user = user_datastore.find_user(email = email)
    influencer=Influencer.query.filter_by(influencer_id=user.id).first()
    ads_list= [
            {
                "id": ad.id,
                "influencer_id": ad.influencer_id,
                "sponsor_id": ad.sponsor_id,
                "description": ad.description,
                "requirement": ad.requirement,
                "payment_amount": ad.payment_amount,
                "status": ad.status,
            }
            for ad in influencer.ads
        ]
    print(ads_list)
    return jsonify(ads_list), 200

@app.route('/search_campaign',methods=['GET'])
def search_campaign():
    email = request.args.get('email')
    from models import Campaign,Influencer
    user=user_datastore.find_user(email=email)
    influencer=Influencer.query.filter_by(influencer_id=user.id).first()
    campaigns=Campaign.query.filter_by(category=influencer.category,visibility="Public").all()
    campaign_list=[
        {
            "id":campaign.id,
            "name":campaign.name,
            "description":campaign.description,
            "start_date":campaign.start_date,
            "end_date":campaign.end_date,
            "budget":campaign.budget,
            "goals":campaign.goals
              
        }
        for campaign in campaigns
    ]
    return jsonify(campaign_list), 200

@app.route('/accept_ad',methods=['GET'])
def accept_ad():
    id = request.args.get("id")
    from models import Ad_request
    ad=Ad_request.query.filter_by(id=id).first()
    ad.status="Accepted"
    db.session.commit()
    return {"message":"Ad accepted"},200

from datetime import datetime
@app.get('/cache')
@cache.cached(timeout=5)
def cache():
   
    return {"time":str(datetime.now())}    

from my_celery.task import add

@app.route('/testing_celery')
def testing_celery():
    task=add.delay(10,10)
    return {'task_id':task.id},200

if __name__ == '__main__':
    app.run(debug=True)
