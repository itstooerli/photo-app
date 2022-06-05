import React from 'react';
import {getHeaders} from './utils';

class Suggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            followingId: null
        }

        this.toggleFollow = this.toggleFollow.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleFollow () {
        if (!this.state.followingId) {
            this.followUser();
        } else {
            this.unfollowUser();
        }
    }

    followUser () {
        const url = '/api/following/';

        const postData = {
            user_id: this.props.suggestion.id
        }

        fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                followingId: data.id
            })
        })
    }

    unfollowUser () {
        const url = '/api/following/' + this.state.followingId;

        fetch(url, {
            method: 'DELETE',
            headers: getHeaders(),
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                followingId: null
            })
        })
    }

    render () {
        const suggestion = this.props.suggestion;
        const alt_text = "profile pic for " + suggestion.username;
        return (
            <section className="asuggestion">
                <img className="pic" src={ suggestion.thumb_url } alt={alt_text} />
                <div>
                    <p className="username">{ suggestion.username }</p>
                    <p className="suggestion-text">suggested for you</p>
                </div>
                <div>
                    <button
                        role="switch"
                        className="link following"
                        aria-label="Follow Button"
                        aria-checked={this.state.followingId ? true : false}
                        onClick={this.toggleFollow}>
                        {!this.state.followingId ? "follow" : "unfollow"}
                    </button>
                </div>
            </section>
        )
    }
}

export default Suggestion;