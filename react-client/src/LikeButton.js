import React from 'react';
import {getHeaders} from './utils';

class LikeButton extends React.Component {

    constructor(props) {
        super(props);
        // initialization code here

        // binding "this":
        this.toggleLike = this.toggleLike.bind(this);
        this.createLike = this.createLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleLike () {
        if (this.props.likeId) {
            this.removeLike();
        } else {
            this.createLike();
        }
    }

    createLike () {
        const url = '/api/posts/likes';
        // console.log('create like:', url);

        const postData = {
            post_id: this.props.postId
        }

        fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            // this needs to trigger a post redraw
            // console.log(data);

            // this is actually calling the parent's method
            this.props.refreshPost();
        })
    }

    removeLike () {
        const url = '/api/posts/likes/' + this.props.likeId;
        // console.log('remove like:', url);
        
        fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            // this needs to trigger a post redraw
            // console.log(data);

            this.props.refreshPost();
        })
    }

    render () {
        const likeId = this.props.likeId;
        const heartClass = (likeId ? 'fas' : 'far') + ' fa-heart';
        return (
            <button 
                role="switch"
                className="like"
                onClick={this.toggleLike}
                aria-label="Like Button"
                aria-checked={likeId ? true : false}>
                <i className={heartClass}></i>
            </button>
        )
    }
}

export default LikeButton;