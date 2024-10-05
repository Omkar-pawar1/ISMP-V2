from flask_restful import Resource,reqparse
from flask_security import auth_required,roles_required
from flask import jsonify

from database import db
from models import User

class New_sponsors(Resource):
    @auth_required('token')
    def get(self):
        Users=User.query.filter_by(active=False).all()
       
        d=dict()
        result=[
            {
            "id":user.id,
            "email":user.email,
            }
            for user in Users
            ]
        
        return jsonify(result)
  