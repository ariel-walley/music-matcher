import React from 'react';

class Playlists extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <li>{this.props.playlistName.name}</li>
            </div>
        );
    }
};

export default Playlists;