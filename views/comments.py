from flask import Response, request
import flask
from flask_restful import Resource
import json
from models import comment, db, Comment, Post
from views import get_authorized_user_ids #added
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        args = request.get_json()

        if 'post_id' not in args or 'text' not in args:
            return Response(json.dumps("New comment requires valid post and text."), mimetype="application/json", status=400)
        
        try:
            post_id = int(args.get('post_id'))
        except:
            return Response(json.dumps("New comment requires valid post and text."), mimetype="application/json", status=400)

        authorized_users = get_authorized_user_ids(self.current_user)
        requested_post = Post.query.get(post_id)
        if not requested_post or requested_post.user_id not in authorized_users:
            return Response(json.dumps("No valid posts."), mimetype="application/json", status=404)

        new_comment = Comment(
            post_id = post_id,
            text = args.get('text'),
            user_id = self.current_user.id
        )

        db.session.add(new_comment)
        db.session.commit()

        # body = Comment.query.get(new_comment.id).to_dict()
        body = new_comment.to_dict()

        return Response(json.dumps(body), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "Comment" record where "id"=id

        comment = Comment.query.get(id)

        if not comment or comment.user_id != self.current_user.id:
            return Response(json.dumps("No valid comments"), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps("Deleted comment " + str(id)), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
