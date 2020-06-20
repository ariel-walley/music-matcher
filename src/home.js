import React from 'react';
import QueryString from 'querystring';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          playlists: [],
          accessToken: ''
        };
        this.getUserMusic = this.getUserMusic.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    async getAccessToken() {
      let body = {
        'grant_type': 'client_credentials'
      }

      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + window.btoa(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_SECRET_KEY)
        },
        body: QueryString.stringify(body)
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({accessToken: data.access_token});
      }).catch((err) => {
        console.log(err);
      })
    }

    getUserMusic() {
      let userName = 'emilytcarlsen';
      
      fetch('https://api.spotify.com/v1/users/' + userName + '/playlists?limit = 50', {
        headers: {
          'Authorization': 'Bearer ' + this.state.accessToken
          }
        }).then((response) => {
          return response.json();
        }).then((data) => {
          this.setState({playlists: data.items});
        }).catch((err) => {
          console.log(err);
        });
    }

    async componentDidMount() {
      await this.getAccessToken();
      this.getUserMusic();
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