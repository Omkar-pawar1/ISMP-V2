import os

from flask import Flask,render_template,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore,roles_required,auth_required, hash_password,verify_password,auth_required, current_user
from database import db
from models import User,Role

from resources.getusers import getuser
from resources.register import Register
from resources.admin import New_sponsors

from flask_cors import CORS


from flask_restful import  Api

# Create app
app = Flask(__name__)
CORS(app)
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



# Create database connection object
db.init_app(app)


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

api.add_resource(getuser, '/users')
api.add_resource(Register, '/register')
api.add_resource(New_sponsors,'/new_sponsors')


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



if __name__ == '__main__':
    app.run(debug=True)
