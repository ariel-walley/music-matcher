import React from 'react';

class Playlists extends React.Component {
    render() {
        return (
            <li key={this.props.playlistName.id}>{this.props.playlistName.name}</li>
        );
    }
};

export default Playlists;