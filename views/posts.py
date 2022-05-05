from flask import Response, request
from flask_restful import Resource
from models import Post, db, User #added
from views import get_authorized_user_ids

import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        # get posts created by one of these users:
        # print(get_authorized_user_ids(self.current_user))
        
        # limit defaults to 20, maximum is 50, must be an integer
        args = request.args
        try:
            limit = int(args.get('limit') or 20)

            if limit > 50:
                return Response(json.dumps("Limit cannot exceed 50."), mimetype="application/json", status=400)

        except:
            return Response(json.dumps("Invalid Limit Parameter."), mimetype="application/json", status=400)

        # query for the posts, modified to sort by earliest post first
        authorized_users = get_authorized_user_ids(self.current_user)
        posts = Post.query.filter(Post.user_id.in_(authorized_users)).order_by(Post.pub_date.desc()).limit(limit).all()

        # create the response
        body = [post.to_dict() for post in posts]
 
        return Response(json.dumps(body), mimetype="application/json", status=200)

    def post(self):
        # create a new post based on the data posted in the body 
        args = request.get_json()

        if 'image_url' not in args:
            return Response(json.dumps("New post requires image."), mimetype="application/json", status=400)
        
        new_post = Post(
            image_url = args.get('image_url'),
            user_id = self.current_user.id,
            caption = args.get('caption'),
            alt_text = args.get('alt_text')
        )

        db.session.add(new_post)
        db.session.commit()

        # body = Post.query.get(new_post.id).to_dict()
        body = new_post.to_dict()

        return Response(json.dumps(body), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        

    def patch(self, id):
        # update post based on the data posted in the body 
        args = request.get_json()
        # print(args)       

        post = Post.query.get(id)

        if not post or post.user_id != self.current_user.id:
            return Response(json.dumps("No valid posts"), mimetype="application/json", status=404)

        if 'image_url' in args:
            post.image_url = args.get('image_url')
        
        if 'caption' in args:
            post.caption = args.get('caption')

        if 'alt_text' in args:
            post.alt_text = args.get('alt_text')
        
        db.session.commit()

        # body = Post.query.get(post.id).to_dict()
        body = post.to_dict()

        return Response(json.dumps(body), mimetype="application/json", status=200)


    def delete(self, id):
        # delete post where "id"=id
        post = Post.query.get(id)

        if not post or post.user_id != self.current_user.id:
            return Response(json.dumps("No valid posts"), mimetype="application/json", status=404)

        Post.query.filter_by(id=id).delete()
        db.session.commit()

        body = User.query.get(self.current_user.id).to_dict()

        return Response(json.dumps(body), mimetype="application/json", status=200)


    def get(self, id):
        # get the post based on the id
        # URL should already check for int representation, otherwise it won't redirect here
        post = Post.query.get(id)
        authorized_users = get_authorized_user_ids(self.current_user)

        if not post or post.user_id not in authorized_users:
            return Response(json.dumps("No valid posts"), mimetype="application/json", status=404)

        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<int:id>', '/api/posts/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )