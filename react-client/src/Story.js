import React from 'react';

class Story extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            story: props.story
        }
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        const story = this.state.story;
        const alt_text = "profile pic for " + story.user.username;
        return (
            <div>
                <img src={ story.user.thumb_url } className="pic" alt={alt_text} />
                <p>{ story.user.username }</p>
            </div>
        )
    }
}

export default Story;