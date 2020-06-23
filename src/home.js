import React from 'react';
import QueryString from 'querystring';
import Lodash from 'lodash';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          fieldInput: '',
          userPlaylists: {}
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
        this.preparePlaylists = this.preparePlaylists.bind(this);
        this.getUserSongs = this.getUserSongs.bind(this);
        this.prepareSongs = this.prepareSongs.bind(this);
        this.prepKeys = this.prepKeys.bind(this);
        this.analyzePlaylists = this.analyzePlaylists.bind(this);
        this.handleChange = this.handleChange.bind(this);        
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
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        this.setState({accessToken: data.access_token});
      }).catch((err) => {
        console.log(err);
      })
    }

    async getUserPlaylists(userName) {   
      await fetch('https://api.spotify.com/v1/users/' + userName + '/playlists?limit=50', {
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

    preparePlaylists(data, userName) {
      let playlists = {};
      for (let i = 0; i < data.length; i++) {
        playlists[data[i].id] = [];
      }
      let userPlaylistsLocal = this.state.userPlaylists;
      userPlaylistsLocal[userName] = playlists;
      this.setState({ 
        userPlaylists: userPlaylistsLocal
      });
    }

    async getUserSongs(userName, playlistID) {    
      await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?fields=items(track(id,name,album(images,name),artists(name)))', {
        headers: {
          'Authorization': 'Bearer ' + this.state.accessToken
          }
        }).then((response) => {
          return response.json();
        }).then((response) => {
          this.prepareSongs(response, userName, playlistID);
        }).catch((err) => {
          console.log(err);
        });
    }

    prepareSongs(data, userName, playlistID) {
      let songs = [];
      for (let i = 0; i < data.items.length; i++) {
        songs.push(data.items[i].track.name);
      }
      let userPlaylistsLocal = this.state.userPlaylists;
      userPlaylistsLocal[userName][playlistID] = songs
      this.setState({ 
        userPlaylists: userPlaylistsLocal
      });
    }

    prepKeys () {
      Object.keys(this.state.userPlaylists).forEach((val1) => {
        console.log(val1);
        Object.keys(this.state.userPlaylists[val1]).forEach((val2) => {
          console.log(val2);
          this.getUserSongs(val1, val2);
        })
      });
    }

    async componentDidMount() {
      await this.getAccessToken();
      await this.getUserPlaylists('emilytcarlsen');
      await this.getUserPlaylists('ariel.walley');
      await this.getUserPlaylists('1229503923'); 
      console.log(this.state.userPlaylists);
      this.prepKeys();
      this.analyzePlaylists();

    }      

    analyzePlaylists() {
      let arielsMusic = this.state.userPlaylists['ariel.walley'];
      let emilysMusic = this.state.userPlaylists['emilytcarlsen'];
      let davesMusic = this.state.userPlaylists['1229503923'];
      let array1 = Object.keys(arielsMusic);
      let array2 = Object.keys(emilysMusic);
      let array3 = Object.keys(davesMusic);
      let duplicates = Lodash.intersection(array1, array2, array3);
      //console.log(duplicates);
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
        </div>
      );
    }
};

export default Home;