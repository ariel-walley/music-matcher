import React from 'react';
import QueryString from 'querystring';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          fieldInput: '',
          userPlaylists: {}
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getUserMusic = this.getUserMusic.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.prepareUsers = this.prepareUsers.bind(this);
        this.preparePlaylists = this.preparePlaylists.bind(this);
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

    usernames = ['ariel.walley', 'emilytcarlsen'];

    prepareUsers(usernames) {
      let users = {}
      for (let i = 0; i < usernames.length; i++) {
        users[usernames[i]] = {}
      }
      this.setState({
        userPlaylists: users
      });
    }

    preparePlaylists(data, userName) {
     
      let playlists = {};
      for (let i = 0; i < data.length; i++) {
        playlists[data[i].name] = [];
      }
      let userPlaylistsLocal = this.state.userPlaylists
      userPlaylistsLocal[userName] = playlists
      this.setState({ 
        userPlaylists: userPlaylistsLocal
      });
    }
         
    getUserMusic(userName) {    
      fetch('https://api.spotify.com/v1/users/' + userName + '/playlists?limit = 50', {
        headers: {
          'Authorization': 'Bearer ' + this.state.accessToken
          }
        }).then((response) => {
          return response.json();
        }).then((response) => {
          this.preparePlaylists(response.items, userName);
        }).catch((err) => {
          console.log(err);
        });
    }
    
    async componentDidMount() {
      this.prepareUsers(this.usernames);
      await this.getAccessToken();
      this.getUserMusic('emilytcarlsen');
      this.getUserMusic('ariel.walley');

    }

    handleChange(event) {
      this.setState({fieldInput: event.target.value});
      console.log(this.state.fieldInput);

    }
   
    render () {
      return (
        <div>
          <p>This is the home page!</p>
          <label>What user do you want to search for?</label>
          <input type='text' value={this.state.title} onChange={this.handleChange}/>
          <p>List of Ariel's Playlists</p>
          {/* {this.state.userPlaylists.emilytcarlsen.map(playlist => (
            <li key={playlist.id}>{playlist}</li>
          ))}
          <ul>
            {this.state.userPlaylists.emilytcarlsen.map(playlist => (
            <li key={playlist.id}>{playlist}</li>
            ))}
          </ul>
           <p>List of Emily's Playlists</p>
          <ul>
            </ul> */}
        </div>
      );
    }
};

export default Home;