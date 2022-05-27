from flask import Response, request
from flask_restful import Resource
import json
from models import User #Added
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class ProfileDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        
        current_user = User.query.get(self.current_user.id)
        body = current_user.to_dict()
        return Response(json.dumps(body), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        ProfileDetailEndpoint, 
        '/api/profile', 
        '/api/profile/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
