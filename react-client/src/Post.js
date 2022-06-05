import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import Comments from './Comments';
import AddComment from './AddComment';
import { getHeaders } from './utils';

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: props.post
        }
        
        this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this)
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    refreshPostDataFromServer () {
        // re-fetch the post:
        const url = '/api/posts/' + this.state.post.id;
        fetch(url, {
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                post: data
            })
        })
    }

    render () {
        const post = this.state.post;

        return (
            <section className="card">
                <div className="header">
                    <h3>
                        {post.user.username}
                    </h3>
                    <button
                        className="buttons"
                        aria-label="More options">
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                </div>

                <img src={post.image_url} alt={post.alt_text || post.user.username + " Post"} />

                <div className="info">
                    <div className="buttons">
                        <div>
                            <LikeButton
                                likeId={post.current_user_like_id} 
                                postId={post.id}
                                refreshPost={this.refreshPostDataFromServer}/>

                            <button 
                                className="to_comment"
                                aria-label="Comment">
                                <i className="far fa-comment"></i>
                            </button>

                            <button 
                                className="share"
                                aria-label="Share Post" >
                                <i className="far fa-paper-plane"></i>
                            </button>
                        </div>
                        
                        <div>
                            <BookmarkButton
                                bookmarkId={post.current_user_bookmark_id} 
                                postId={post.id}
                                refreshPost={this.refreshPostDataFromServer}/>
                        </div>
                    </div>
                    
                    <p className="likes">
                        <strong>
                            {post.likes.length === 1 ? `1 like` : post.likes.length + ' likes'}
                        </strong>
                    </p>

                    <div className="caption">
                        <p>
                            <strong> {post.user.username} </strong>
                            { post.caption }
                        </p>
                        <p className="timestamp">
                            { post.display_time }
                        </p>
                    </div>

                    <Comments 
                        comments={post.comments}/>

                    <AddComment
                        postId={post.id}
                        refreshPost={this.refreshPostDataFromServer}/>

                </div>
            </section>
        )
    }
}

export default Post;