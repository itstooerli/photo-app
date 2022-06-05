import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.textInput = React.createRef();

        // binding "this":
        this.handleChange = this.handleChange.bind(this);
        this.createComment = this.createComment.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    createComment (event) {
        event.preventDefault();
        
        const url = '/api/comments/';

        const postData = {
            post_id: this.props.postId,
            text: this.state.value
        }

        fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                value: ''
            })
            this.props.refreshPost();
        })
    }

    focusTextInput() {
        this.textInput.current.focus();
    }

    render () {
        return (
            <form 
                className="add-comment"
                onSubmit={this.createComment}>

                <div className="input-holder">
                    <input
                        className="comment-textbox"
                        aria-label="Add a comment"
                        placeholder="Add a comment..."
                        value={this.state.value}
                        ref={this.textInput}
                        onChange={this.handleChange}/>
                </div>
                <button 
                        type="submit"
                        className="link"
                        data-post-id={this.props.postId}
                        onClick={this.focusTextInput}
                        >
                        Post
                </button>
            </form>
        )
    }
}

export default AddComment;