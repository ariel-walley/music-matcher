import React from 'react';
import './App.css';
import DisplayData from './userdata';
import QueryString from 'querystring';
import _ from 'lodash';
import styled from 'styled-components';
import GlobalStyle from './globalStyles';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content; center;
`;

const Header = styled.h1`
  text-align: center;
  margin: 20px auto 0 auto;
  font-size: 70px;
  color: white;
`;

const About = styled.p`
  text-align: center;
  margin: 0 auto 30px auto;
  font-weight: 5500px;
  font-size: 18px;
  color: white;
`;

const InputLabels = styled.label`
  text-align: center;
  margin: 10px;
  font-weight: 700px;
  font-size: 20px;
  color: white;
`;

const InputDiv = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const InputField = styled.input`
  margin: 20px;
  border: 0;
  height: 35px;
  width: 250px;
  border-radius: 5px;
`;

const Tutorial = styled.p`
  text-align: center;
  margin: 10px;
  font-weight: 5500px;
  font-size: 18px;
  color: white;
`;

const SubmitButton = styled.button`
  margin: 10px auto;
  padding: 7px;
  background-color: white;
  font-size: 16px;
  border: 0;
  border-radius: 5px;
`;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          fieldInput: '',
          duplicatesFound: false,
          mainUsername: '',
          display: false
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.startSongs = this.startSongs.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.prepSongs = this.prepSongs.bind(this);
        this.findDuplicateSongs = this.findDuplicateSongs.bind(this);
        this.getDuplicatesInfo = this.getDuplicatesInfo.bind(this);
        this.handleChangeMain = this.handleChangeMain.bind(this);
        this.handleChangeFriend = this.handleChangeFriend.bind(this);
        this.displayOtherUsers = this.displayOtherUsers.bind(this);
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

    async getUserData(user) {   
      let playlists = [];
      let next = `https://api.spotify.com/v1/users/${user}/playlists?limit=50`;

      while(next != null) {
        try {
          let response = await fetch(next, {
            headers: {
              'Authorization': 'Bearer ' + this.state.accessToken
            },
          });
          let data = await response.json();
          let playlistsChunk = data.items.map(playlist => { return playlist.id });
          playlists.push(...playlistsChunk);
          next = data.next;
        } catch(err) {
            console.error(err);
        };
      }

      let allSongs = await this.startSongs(playlists);
      let allUniqSongs = _.uniq(allSongs);
      return allUniqSongs;
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
      let playlistSongs = [];
      let next = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track(id,name,album(images,name),artists(name))),limit,next,offset,previous,total`
      
      while(next !=null) {
        try {
          let response = await fetch(next, {
            headers: {
              'Authorization': 'Bearer ' + this.state.accessToken
              }
          });
          
          let data = await response.json();
          let songsChunk = data.items.map(song => { return song.track.id });
          playlistSongs.push(...songsChunk);
          next = data.next;
        } catch (err) {
          console.log(err);
        }
      }
      return playlistSongs;
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
              "image": song.album.images[1].url,
              "albumName": `The cover art of the song's all: ${song.album.name}`
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

    handleChangeMain(event) {
      this.setState({
        mainUsername: event.target.value
      })
      if (this.state.mainUsername.length > 1) {
        this.setState({
          display: true
        })
      }
    }

    handleChangeFriend(event) {
      this.setState({
        [event.target.id]: event.target.value
      })
    }


    displayOtherUsers() {
      if (this.state.display === true) {
        return (
          <div>       
            <InputLabels>Enter up to three other Spotify users to compare your music picks:</InputLabels>
                <InputDiv>
                  <InputField type="text" id="username0" onChange={this.handleChangeFriend}/>
                  <InputField type="text" id="username1" onChange={this.handleChangeFriend}/>
                  <InputField type="text" id="username2" onChange={this.handleChangeFriend}/>
                </InputDiv>
          </div>
        )  
      }
    }

    async componentDidMount() {
      try {
        await this.getAccessToken();
        let users = ['1229503923', 'ariel.walley'];
        let compareSongs = [];
        for (let user of users) {
          let uniqSongs = await this.getUserData(user); //gets user data and filters our users' duplicate songs (i.e., user added the same song to multiple playlists);
          compareSongs.push(uniqSongs);
        };
        let duplicateSongs = await this.findDuplicateSongs(compareSongs);
      } catch (err) {
        console.log(err);
      }
    }    

    render () {
      return (
          <div>
            <GlobalStyle/>
            <MainContainer> 
              <Header>Welcome to Music Matcher!</Header>
              <About>Find out which songs you and your friends have in common in your public playlists in Spotify!</About>
              <InputLabels for="your_username">Enter your Spotify username here:</InputLabels>
              <InputDiv>
                <InputField type="text" id="your_username" onChange={this.handleChangeMain}/>
              </InputDiv>
              {this.displayOtherUsers()}
              <Tutorial>Not sure how to find a Spotify username? Click here for help!</Tutorial>
              <SubmitButton type="submit">Submit</SubmitButton>
            </MainContainer>
            <DisplayData data={this.state}/>
          </div>
      );
    }
};

export default Home;