import React from 'react';
import Playlists from './playlists';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {playlists: [] };
        this.getUserMusic = this.getUserMusic.bind(this);
    }

    componentDidMount() {
      this.getUserMusic();
    }

    getUserMusic() {
      let accessToken = 'BQCwHJ2mraqflmKkbxBq6ZUO3A7CR79odHhj5PwO4oby6LBjBiI3nUxcbV99eAxEaOlOKtZv2h7eXECagOs';
      let userName = 'emilytcarlsen';
      
      fetch('https://api.spotify.com/v1/users/' + userName + '/playlists?limit = 50', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
          }
        }).then((response) => {
          return response.json();
        }).then((data) => {
          this.setState({playlists: data.items});
        }).catch((err) => {
          console.log(err);
        });
    }

    render () {
      return (
        <div>
          <p>This is the home page!</p>
          <p>List of Emily's Playlists</p>
          <ul>
            {this.state.playlists.map(playlist => (
            <li key={playlist.id}>{playlist.name}</li>
            ))}
          </ul>
        </div>
      );
    }
};









export default Home;