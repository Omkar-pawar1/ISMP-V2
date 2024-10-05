from flask_restful import Resource
from database import db
from models import User

class getuser(Resource):
    def get(self):
        Users=db.session.query(User).all()
        d=dict()
        for user in Users:
            d[user.id]=user.email
        print(d)
            
        return (d)