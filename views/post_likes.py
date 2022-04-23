from flask import Response, request
from flask_restful import Resource
from models import LikePost, db, Post #added
import json
from views import get_authorized_user_ids #added

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        args = request.get_json()
        # print(args)

        if 'post_id' not in args:
            return Response(json.dumps("New likes require post_id."), mimetype="application/json", status=400)

        try:
            post_id = int(args.get('post_id'))
        except:
            return Response(json.dumps("New likes require post_id."), mimetype="application/json", status=400)

        authorized_users = get_authorized_user_ids(self.current_user)
        requested_post = Post.query.get(post_id)
        if not requested_post or requested_post.user_id not in authorized_users:
            return Response(json.dumps("No valid posts."), mimetype="application/json", status=404)

        existing_like = LikePost.query.filter_by(user_id=self.current_user.id).filter_by(post_id=post_id).all()

        if existing_like:
            return Response(json.dumps("Existing like."), mimetype="application/json", status=400)

        new_like = LikePost(
            post_id = post_id,
            user_id = self.current_user.id
        )

        db.session.add(new_like)
        db.session.commit()

        body = LikePost.query.get(new_like.id).to_dict()

        return Response(json.dumps(body), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id
        # print(id)

        like = LikePost.query.get(id)

        if not like or like.user_id != self.current_user.id:
            return Response(json.dumps("No valid likes"), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps("Deleted like " + str(id)), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
