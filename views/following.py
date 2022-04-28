from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from views import get_authorized_user_ids #added

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        followings = Following.query.filter_by(user_id=self.current_user.id).all()
        
        # body = []
        # for following in followings:
        #     body.append(following.to_dict_following())
        body = [following.to_dict_following() for following in followings]

        return Response(json.dumps(body), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        args = request.get_json()
        # print(args)

        if 'user_id' not in args:
            return Response(json.dumps("New following requires user."), mimetype="application/json", status=400)
        
        try:
            user_id = int(args.get('user_id'))
        except:
            return Response(json.dumps("New following requires user."), mimetype="application/json", status=400)

        requested_user = User.query.get(user_id)
        if not requested_user:
            return Response(json.dumps("No valid users."), mimetype="application/json", status=404)
        
        authorized_users = get_authorized_user_ids(self.current_user)
        if user_id in authorized_users:
            return Response(json.dumps("Already following user."), mimetype="application/json", status=400)

        new_following = Following(
            following_id = user_id,
            user_id = self.current_user.id
        )

        db.session.add(new_following)
        db.session.commit()

        # body = Following.query.get(new_following.id).to_dict_following()
        body = new_following.to_dict_following()

        return Response(json.dumps(body), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        # print(id)

        following = Following.query.get(id)

        if not following or following.user_id != self.current_user.id:
            return Response(json.dumps("No valid following"), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps("Deleted following " + str(id)), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
