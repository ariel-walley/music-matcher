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

const Error = styled.p`
  text-align: center;
  color: red;
`;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accessToken: '',
          users: {
            mainUsername: ''
          },
          userDisplay: false,
          mainUsername: '',
          usernames: {},
          errors: {},
          duplicatesFound: false
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.handleChangeMainUsername = this.handleChangeMainUsername.bind(this);
        this.displayOtherUsers = this.displayOtherUsers.bind(this);
        this.handleChangeOtherUsername = this.handleChangeOtherUsername.bind(this);
        this.verifyUsernames = this.verifyUsernames.bind(this);
        this.displayError = this.displayError.bind(this);
        this.submitUsernames = this.submitUsernames.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.startSongs = this.startSongs.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.findDuplicateSongs = this.findDuplicateSongs.bind(this);
        this.getDuplicatesInfo = this.getDuplicatesInfo.bind(this);
        this.reset = this.reset.bind(this);
    }

    /*    Requesting access token    */
    async componentDidMount() {
      await this.getAccessToken();
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

    /*    Handle user ID input, the input display, and verifying usernames    */
    handleChangeMainUsername(event) { //Set state with main username input and decide whether to other other users' block
      let id = event.target.id;
      let value = event.target.value;
      this.setState(() => ({
        userDisplay: (value.length > 2 || this.state.userDisplay) ? true : false, 
        users: {
          ...this.state.users,
          mainUsername: value
        }
      }));
    }

    displayOtherUsers() { //Display block for other users' inputs
      if (this.state.userDisplay === true) {
        return (
          <MainContainer>       
            <InputLabels>Enter up to three other Spotify users to compare your music picks:</InputLabels>
                <InputDiv>
                  <InputField type="text" id="username0" onChange={this.handleChangeOtherUsername}/>
                  <InputField type="text" id="username1" onChange={this.handleChangeOtherUsername}/>
                  <InputField type="text" id="username2" onChange={this.handleChangeOtherUsername}/>
                </InputDiv>
          </MainContainer>
        )  
      }
    }

    handleChangeOtherUsername(event) { //Set state with username input for other users
      let id = event.target.id;
      let value = event.target.value;
      this.setState(() => ({
        users: {
          ...this.state.users, 
          [id]: value
        }
      }));
    }

    async verifyUsernames() { //Request display names from API and verify username input

      let userIDs = Object.values(this.state.users); //Trim white space in input fields and eliminate null or empty options
      let users = [];
      for (let user of userIDs) { 
        let trimmedUser = user.trim();
        if (trimmedUser !== "" && trimmedUser !== null && trimmedUser !== '') {
          if (trimmedUser.search("spotify:user:") > -1 ) {
            trimmedUser = trimmedUser.slice(13);
          }
          users.push(trimmedUser)
        }
      }

      let mainUsername = this.state.users.mainUsername //Identify the main user
        if (mainUsername.search("spotify:user:") > -1 ) {
          mainUsername = mainUsername.slice(13);
        }
      this.setState({
          mainUsername: mainUsername
      })  


      for (let user of users) { //Fetch request for display names/user verification
        let url = `https://api.spotify.com/v1/users/${user}`
        try {
          let response = await fetch(url, {
            headers: {
              'Authorization': 'Bearer ' + this.state.accessToken
            },
          });
          let data = await response.json();
          this.setState({
            usernames: {
              ...this.state.usernames,
              [user]: data.display_name
            }
          })
        } catch(err) {
            console.error(err);
        };             
      }
      let displaynames = Object.values(this.state.usernames); //Verify usernames (no undefined display names)
      let undefinedFound = displaynames.indexOf(undefined);

      this.setState({
        errors: {
          invalidUserID: (undefinedFound > -1) ? true : false,
          minimumUsersError: (users.length > 1) ? false : true
        }
      })
    }

    displayError() { //Display error is username is invalid
      if (this.state.errors.invalidUserID === true) {
        return (
          <div>       
            <Error>Please enter a valid username.</Error>
          </div>
        )  
      } else if (this.state.errors.minimumUsersError === true) {
        return (
          <div>       
            <Error>Please enter at least two usernames.</Error>
          </div>
        )
      }
    }

    /*    Request user, playlist, and song data from Spotify API    */
    async submitUsernames() { //MAIN FUNCTION, start API request process
      await this.reset();
      await this.verifyUsernames();
      if (this.state.errors.invalidUserID === false) {
        try {
          let compareSongs = [];
          let users = Object.keys(this.state.usernames);
          for (let user of users) {
            let songs = await this.getUserData(user); //gets user data and filters our users' duplicate songs (i.e., user added the same song to multiple playlists);
            compareSongs.push(songs);
          };
          let duplicateSongs = await this.findDuplicateSongs(compareSongs); 
        } catch (err) {
          console.log(err);
        }
      }
    }

    async getUserData(user) { //Requests user's playlists IDs
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

    async startSongs (playlists) { //Loops through playlists to send off requests for each playlists' songs
      let allSongs = [];
      for(let playlistID of playlists) {
        let playlistData = await this.fetchSongs(playlistID);
        allSongs.push(playlistData);
      }
      return allSongs.flat();
    }

    async fetchSongs(playlistID) { //Requests playlists' songs
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

    /*    Find duplicates from data    */ 
    async findDuplicateSongs(arrays) { //Find duplicates data and set in state
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

    async getDuplicatesInfo(duplicates) { //Request song data (title, artist, album data, etc.)   
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

    /*    Reset functions    */
    async reset() {
      this.setState({
        accessToken: this.state.accessToken,
        users: this.state.users,
        userDisplay: true,
        mainUsername: '',
        usernames: {},
        errors: {},
        duplicatesFound: false    
      })
    }

    /*    Render    */
    render () {
      return (
          <div>
            <GlobalStyle/>
            <MainContainer> 
              <Header>Welcome to Music Matcher!</Header>
              <About>Find out which songs you and your friends have in common in your public playlists in Spotify!</About>
              <InputLabels for="your_username">Enter your Spotify username here:</InputLabels>
              <InputDiv>
                <InputField type="text" id="your_username" onChange={this.handleChangeMainUsername}/>
              </InputDiv>
              {this.displayOtherUsers()}
              {this.displayError()}
              <Tutorial>Not sure how to find a Spotify username? Click here for help!</Tutorial>
              <SubmitButton type="submit" onClick={this.submitUsernames}>Submit</SubmitButton>
            </MainContainer>
            <DisplayData data={this.state}/>
          </div>
      );
    }
};

export default Home;