import React from 'react';
import {getHeaders} from './utils';
import Story from './Story';

class Stories extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            stories: []
        }

        this.getStoriesFromServer()
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    getStoriesFromServer () {
        fetch('/api/stories', {
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                stories: data
            })
        })
    }

    render () {
        return (
            <header className="stories">
                { this.state.stories.map(story => {
                    return (
                        <Story
                            key={'story_' + story.id}
                            story={story} />
                    )
                })}
            </header>
        )
    }
}

export default Stories;