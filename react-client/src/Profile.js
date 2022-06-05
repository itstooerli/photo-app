import React from 'react';

class Profile extends React.Component {

    // constructor(props) {
    //     super(props);
    //     // initialization code here
    // }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        const alt_text = this.props.user.username + "profile"
        return (
            <header className="user">
                <img
                    className="pic"
                    src={this.props.user.thumb_url}
                    alt={alt_text} />
                <h1>
                    {this.props.user.username}
                </h1>
            </header>
        )
    }
}

export default Profile;