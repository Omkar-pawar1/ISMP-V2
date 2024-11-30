
from flask_restful import Resource, reqparse
from flask_security import auth_required, roles_required, current_user
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from database import db

parser = reqparse.RequestParser()
parser.add_argument('name', required=True, help="Campaign name is required.")
parser.add_argument('description', required=True, help="Campaign description is required.")
parser.add_argument('start_date', required=True, help="Start date is required.")
parser.add_argument('end_date', required=True, help="End date is required.")
parser.add_argument('budget', type=float, required=True, help="Budget must be a number.")
parser.add_argument('visibility', choices=('Public', 'Private'), required=True, help="Visibility must be Public or Private.")
parser.add_argument('goal', required=True, help="Goals are required.")
parser.add_argument('category', required=True, help="Category is required.")

class CreateCampaign(Resource):
    @auth_required('token')
    def post(self):
        from models import Campaign  # Import inside to prevent circular dependencies

        args = parser.parse_args()
        
        try:
            # Create a new campaign
            campaign = Campaign(
                name=args['name'],
                description=args['description'],
                start_date=args['start_date'],
                end_date=args['end_date'],
                visibility=args['visibility'],
                budget=args['budget'],
                goals=args['goal'],
                category=args['category'],
                sponsor_id=current_user.id
            )
            
            # Add to the database
            db.session.add(campaign)
            db.session.commit()

            # Return success response
            return {"message": "Campaign created successfully", "campaign_id": campaign.id}, 201
        
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": "Failed to create campaign", "details": str(e)}, 500
        
        except Exception as e:
            return {"error": "An unexpected error occurred", "details": str(e)}, 500


        
      

