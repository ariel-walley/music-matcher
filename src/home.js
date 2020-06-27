import React from 'react';
import DisplayData from './userdata';
import QueryString from 'querystring';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          fieldInput: '',
          userPlaylists: {},
          loaded: false
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.preparePlaylists = this.preparePlaylists.bind(this);
        this.getUserSongs = this.getUserSongs.bind(this);
        this.prepareSongs = this.prepareSongs.bind(this);
        this.prepKeys = this.prepKeys.bind(this);
        this.compileSongs = this.compileSongs.bind(this);
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
        console.log(data.access_token);
        this.setState({accessToken: data.access_token});
      }).catch((err) => {
        console.log(err);
      })
    }

    async getUserData(users) { //hi, i'm a new function for the next commit!
      users.forEach( async (user) => {
        await this.getUserPlaylists(user);
      }
      )
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
      this.setState({
        loaded: true
      })
    }

    prepKeys () {
      Object.keys(this.state.userPlaylists).forEach((val1) => {
        Object.keys(this.state.userPlaylists[val1]).forEach((val2) => {
          this.getUserSongs(val1, val2);
        })
      });
    }

    async componentDidMount() { //this setTimeout needs to be addressed
      await this.getAccessToken();
      await this.getUserData(['emilytcarlsen', 'ariel.walley', '1229503923']); 
      setTimeout(() => { //this setTimeout very much needs to go away
        this.prepKeys();
      }, 2000);
      setTimeout(() => {
        this.compileSongs();
      }, 15000);
    }      

    compileSongs() {
      let allSongs = [];
      console.log('your function is running now');
      Object.keys(this.state.userPlaylists).forEach((user) => {
        console.log(user);
        Object.keys(this.state.userPlaylists[user]).forEach((playlist) => {
          console.log(playlist);
          Object.values(this.state.userPlaylists[user][playlist]).forEach((song) => {
            allSongs.push(song);
          });
        });
        let userPlaylistsLocal = this.state.userPlaylists;
        userPlaylistsLocal[user].allSongs = allSongs;
        this.setState({ 
          userPlaylists: userPlaylistsLocal
        });
      })
    }

    // how to handle duplicates... first, assemble all songs from user into one array. remove duplicates. combine all uers songs into one array. return duplicates.

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
          <DisplayData data={this.state}/>
        </div>
      );
    }
};

export default Home;