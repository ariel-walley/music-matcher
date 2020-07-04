import React from 'react';
import DisplayData from './userdata';
import QueryString from 'querystring';
import _ from 'lodash';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          fieldInput: '',
          duplicatesFound: false
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.prepPlaylists = this.prepPlaylists.bind(this);
        this.startSongs = this.startSongs.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.prepSongs = this.prepSongs.bind(this);
        this.findDuplicateSongs = this.findDuplicateSongs.bind(this);
        this.getDuplicatesInfo = this.getDuplicatesInfo.bind(this);
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

    async getUserData(userName) {   
      try {
        let response = await fetch(`https://api.spotify.com/v1/users/${userName}/playlists?limit=50`, {
          headers: {
            'Authorization': 'Bearer ' + this.state.accessToken
          },
        });
        let data = await response.json();
        let playlists = this.prepPlaylists(data.items); 
        let allSongs = await this.startSongs(playlists);
        let allUniqSongs = _.uniq(allSongs);
        return allUniqSongs;
      } catch(err) {
          console.log(err);
      };
    }

    prepPlaylists(data) { 
      let playlists = [];
      for (let playlist of data) {
        playlists.push(playlist.id);
      }
      return playlists;
    }

    async startSongs (playlists) {
      let allSongs = [];
      for(let playlistID of playlists) {
        let playlistData = await this.fetchSongs(playlistID);
        allSongs.push(playlistData);
      }
      return allSongs.flat();
    }

    async fetchSongs(playlistID) {   
      try {
      let response = await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?fields=items(track(id,name,album(images,name),artists(name)))', {
        headers: {
          'Authorization': 'Bearer ' + this.state.accessToken
          }
      });
      let data = await response.json();
      let prepSongs = this.prepSongs(data.items);
      return prepSongs;
      } catch (err) {
        console.log(err);
      }
    }

    prepSongs(data) {
      let songs = []; 
      for (let song in data) {
        songs.push(data[song].track.id);
      }
      return songs;
    }

    async findDuplicateSongs(arrays) {
      let duplicates = _.intersection(...arrays);
      _.pull(duplicates, null);
      let allDuplicateInfo = [];

      while(duplicates.length) {
        let splitDuplicates = duplicates.splice(0,50);
        let apiDuplicates = splitDuplicates.join(",");
        let duplicateInfo = await this.getDuplicatesInfo(apiDuplicates);
        for (let song of duplicateInfo.tracks) {
          let artists = [];
          for (let artist of song.artists) {
            artists.push(artist.name);
          };
          allDuplicateInfo.push(
            { "id": song.id,
              "name": song.name,
              "artist": artists.join(", "),
              "image": song.album.images[2].url
            }
          );
        };
        this.setState({
          duplicateData: allDuplicateInfo,
          duplicatesFound: true
        }); 
      }
    }

    async getDuplicatesInfo(duplicates) {     
      try {
        let response = await fetch('https://api.spotify.com/v1/tracks/?ids=' + duplicates, {
          headers: {
            'Authorization': 'Bearer ' + this.state.accessToken
            }
        });
        return await response.json();
        } catch (err) {
          console.log(err);
        }
    }

    handleChange(event) {
      this.setState({fieldInput: event.target.value});
      console.log(this.state.fieldInput);
    }

    async componentDidMount() {
      try {
        await this.getAccessToken();
        let users = ['emilytcarlsen', 'ariel.walley'];
        let compareSongs = [];
        for (let user of users) {
          let uniqSongs = await this.getUserData(user); //gets user data and filters our users' duplicate songs (i.e., user added the same song to multiple playlists);
          compareSongs.push(uniqSongs); //
        };
        let duplicateSongs = await this.findDuplicateSongs(compareSongs);
        //this.getDuplicatesInfo(duplicateSongs);
      } catch (err) {
        console.log(err);
      }
    }    

    render () {
      return (
        <div>
          <p>This is the home page!</p>
          <label>What user do you want to search for?</label>
          <input type='text' onChange={this.handleChange}/>
          <DisplayData data={this.state}/>
        </div>
      );
    }
};

export default Home;