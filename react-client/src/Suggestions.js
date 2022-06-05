import React from 'react';
import {getHeaders} from './utils';
import Suggestion from './Suggestion';

class Suggestions extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            suggestions: []
        }

        this.getSuggestionsFromServer()
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }
    
    getSuggestionsFromServer () {
        fetch('/api/suggestions', {
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                suggestions: data
            })
        })
    }

    render () {
        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                { this.state.suggestions.map(suggestion => {
                    return (
                        <Suggestion
                            key={'suggestion_' + suggestion.id}
                            suggestion={suggestion} />
                    )
                })}
            </div>
        )
    }
}

export default Suggestions;