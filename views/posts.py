from flask import Response, request
from flask_restful import Resource
from models import Post, db
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
        args = request.args
        authorized_users = get_authorized_user_ids(self.current_user)

        # limit defaults to 10, maximum is 50, must be an integer
        try:
            limit = min(int(args.get('limit') or 10), 50)
        except:
            return Response(json.dumps("Invalid Limit Parameter"), mimetype="application/json", status=400)

        # query for the posts
        posts = Post.query.filter(Post.user_id.in_(authorized_users)).limit(limit).all()

        # create the response
        body = []
        for post in posts:
            body.append(post.to_dict())
 
        return Response(json.dumps(body), mimetype="application/json", status=200)

    def post(self):
        # create a new post based on the data posted in the body 
        body = request.get_json()
        print(body)  
        return Response(json.dumps({}), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        

    def patch(self, id):
        # update post based on the data posted in the body 
        body = request.get_json()
        print(body)       
        return Response(json.dumps({}), mimetype="application/json", status=200)


    def delete(self, id):
        # delete post where "id"=id
        return Response(json.dumps({}), mimetype="application/json", status=200)


    def get(self, id):
        # get the post based on the id
        post = Post.query.get(id)
        if post:
            return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
        else:
            return Response(json.dumps("404 NOT FOUND"), mimetype="application/json", status=404)

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