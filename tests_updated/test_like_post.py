import utils
import requests

root_url = utils.root_url
import unittest

class TestLikePostListEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_random_user()
        pass

    def test_like_post_valid_request_201(self):
        post_id = utils.get_unliked_post_id_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/likes'.format(root_url)
        response = utils.issue_post_request(url, json={
            'post_id': post_id
        }, user_id=self.current_user.get('id'))
        # print(response.text)
        self.assertEqual(response.status_code, 201)
        new_like = response.json()

        # check that the values are in the returned json:
        self.assertEqual(new_like.get('post_id'), post_id)
        self.assertEqual(new_like.get('user_id'), self.current_user.get('id'))

        # check that it's really in the database:
        new_like_db = utils.get_liked_post_by_id(new_like.get('id'))
        self.assertEqual(new_like_db.get('id'), new_like.get('id'))

        # now delete like from DB:
        utils.delete_like_by_id(new_like.get('id'))

        # and check that it's gone:
        self.assertEqual(utils.get_liked_post_by_id(new_like.get('id')), [])

    def test_like_post_jwt_required(self):
        post_id = utils.get_unliked_post_id_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes'.format(root_url, post_id)
        response = requests.post(url, json={})
        self.assertTrue(response.status_code, 401)

    def test_like_post_no_duplicates_400(self):
        liked_post = utils.get_liked_post_by_user(self.current_user.get('id'))
        # print(liked_post)
        url = '{0}/api/posts/likes'.format(root_url)
        response = utils.issue_post_request(url, json={
            'post_id': liked_post.get('post_id')
        }, user_id=self.current_user.get('id'))
        # print(liked_post.get('post_id'))
        # print(response.text)
        self.assertEqual(response.status_code, 400)

    def test_like_post_invalid_post_id_404(self):
        response = utils.issue_post_request(root_url + '/api/posts/99999/likes', json={}, user_id=self.current_user.get('id'))
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    def test_like_post_unauthorized_post_id_404(self):
        post = utils.get_post_that_user_cannot_access(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes'.format(root_url, post.get('id'))
        response = utils.issue_post_request(url, json={}, user_id=self.current_user.get('id'))
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    
class TestLikePostDetailEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_random_user()
        pass

    def test_like_post_delete_valid_200(self):
        liked_post = utils.get_liked_post_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/likes/{1}'.format(
            root_url, 
            liked_post.get('id')
        )
        # print(url)
        response = utils.issue_delete_request(url, user_id=self.current_user.get('id'))
        # print(response.text)
        self.assertEqual(response.status_code, 200)

        # restore the post in the database:
        utils.restore_liked_post(liked_post)

    def test_like_post_delete_jwt_required(self):
        liked_post = utils.get_liked_post_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes/{2}'.format(
            root_url, 
            liked_post.get('post_id'), 
            liked_post.get('id')
        )
        print(url)
        response = requests.delete(url)
        self.assertTrue(response.status_code, 401)

    def test_like_post_delete_invalid_id_format_404(self):
        liked_post = utils.get_liked_post_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes/{2}'.format(
            root_url, 
            liked_post.get('post_id'), 
            'sdfsdfdsf'
        )
        response = utils.issue_delete_request(url, user_id=self.current_user.get('id'))
        self.assertEqual(response.status_code, 404)
        
    
    def test_like_post_delete_invalid_id_404(self):
        liked_post = utils.get_liked_post_by_user(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes/{2}'.format(
            root_url, 
            liked_post.get('post_id'), 
            99999
        )
        response = utils.issue_delete_request(url, user_id=self.current_user.get('id'))
        self.assertEqual(response.status_code, 404)

        
    def test_like_post_delete_unauthorized_id_404(self): 
        unauthorized_liked_post = utils.get_liked_post_that_user_cannot_delete(self.current_user.get('id'))
        url = '{0}/api/posts/{1}/likes/{2}'.format(
            root_url, 
            unauthorized_liked_post.get('post_id'), 
            unauthorized_liked_post.get('id')
        )
        response = utils.issue_delete_request(url, user_id=self.current_user.get('id'))
        self.assertEqual(response.status_code, 404)
        

if __name__ == '__main__':
    # to run all of the tests:
    # unittest.main()

    # to run some of the tests (convenient for commenting out some of the tests):
    suite = unittest.TestSuite()
    suite.addTests([
        
        # POST Tests:
        TestLikePostListEndpoint('test_like_post_valid_request_201'),
        TestLikePostListEndpoint('test_like_post_jwt_required'),
        TestLikePostListEndpoint('test_like_post_no_duplicates_400'),
        TestLikePostListEndpoint('test_like_post_invalid_post_id_404'),
        TestLikePostListEndpoint('test_like_post_unauthorized_post_id_404'),

        # DELETE Tests:
        TestLikePostDetailEndpoint('test_like_post_delete_valid_200'),
        TestLikePostDetailEndpoint('test_like_post_delete_jwt_required'),
        TestLikePostDetailEndpoint('test_like_post_delete_invalid_id_format_404'),
        TestLikePostDetailEndpoint('test_like_post_delete_invalid_id_404'),
        TestLikePostDetailEndpoint('test_like_post_delete_unauthorized_id_404'),    
    ])

    unittest.TextTestRunner(verbosity=2).run(suite)