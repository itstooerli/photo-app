from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post #added
import json
from views import get_authorized_user_ids #added

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        body = []
        for bookmark in bookmarks:
            body.append(bookmark.to_dict())

        return Response(json.dumps(body), mimetype="application/json", status=200)

    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        args = request.get_json()
        # print(body)

        if 'post_id' not in args:
            return Response(json.dumps("New bookmark requires post."), mimetype="application/json", status=400)
        
        try:
            post_id = int(args.get('post_id'))
        except:
            return Response(json.dumps("New bookmark requires post."), mimetype="application/json", status=400)

        authorized_users = get_authorized_user_ids(self.current_user)
        requested_post = Post.query.get(post_id)
        if not requested_post or requested_post.user_id not in authorized_users:
            return Response(json.dumps("No valid posts."), mimetype="application/json", status=404)
        
        existing_bookmark = Bookmark.query.filter_by(user_id=self.current_user.id).filter_by(post_id=post_id).all()

        if existing_bookmark:
            return Response(json.dumps("Existing bookmark."), mimetype="application/json", status=400)

        new_bookmark = Bookmark(
            post_id = post_id,
            user_id = self.current_user.id
        )

        db.session.add(new_bookmark)
        db.session.commit()

        body = Bookmark.query.get(new_bookmark.id).to_dict()
        return Response(json.dumps(body), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        # print(id)

        bookmark = Bookmark.query.get(id)

        if not bookmark or bookmark.user_id != self.current_user.id:
            return Response(json.dumps("No valid bookmarks"), mimetype="application/json", status=404)

        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps("Deleted bookmark " + str(id)), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
