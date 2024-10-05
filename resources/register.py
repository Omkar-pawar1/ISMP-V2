from flask_restful import Resource,reqparse
from database import db



from models import User

parser = reqparse.RequestParser()
parser.add_argument('email')
parser.add_argument('password')
parser.add_argument('role')




class Register(Resource):
    def post(self):
        from app import user_datastore 
        from flask_security import  hash_password
        args = parser.parse_args()
        print(args)
        email=args['email']
        password=args['password']
        role=args['role']
        if not user_datastore.find_user(email = email):
            if role=="sponsor":
                user_datastore.create_user(email = email, password = hash_password(password), roles=[role],active=False)
            else:
                user_datastore.create_user(email = email, password = hash_password(password), roles=[role])
        db.session.commit()
        print("successfully created")

        return {1:"ok"},201