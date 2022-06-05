import React from 'react';

class Comments extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        const comments = this.props.comments;
        const numComments = comments.length;


        if (numComments === 0){
            return (
                <div className="comments">
                    <p></p>
                </div>
            )
        }
        else if (numComments === 1){
            return (
                <div className="comments">
                    <p>
                        <strong> { comments[0].user.username } </strong>
                        { comments[0].text }
                    </p>
                    <p className="timestamp">
                        { comments[0].display_time }
                    </p>
                </div>
            )
        } else {
            return (
                <div className="comments">
                    <button className="link">
                        View all { numComments } comments
                    </button>
                    <p>
                        <strong> { comments[0].user.username } </strong>
                        { comments[0].text }
                    </p>
                    <p className="timestamp">
                        { comments[0].display_time }
                    </p>
                </div>
            )
        }
    }
}

export default Comments;