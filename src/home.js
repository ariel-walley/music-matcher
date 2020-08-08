import React from 'react';
import DisplayData from './userdata';
import QueryString from 'querystring';
import _ from 'lodash';
import styled, { keyframes } from 'styled-components';
import Popup from './instructions';
import GlobalStyle from './globalStyles';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  background-attachment: fixed;
`;

const Gradient = styled.div`
  height: 100%;
  width: 100%;
  background: ${props => props.color};
  background-attachment: fixed;
  transition: opacity 8s;
  opacity: ${props => props.status ? 1 : 0};
  position: fixed;
  z-index: -1;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${props => props.status === "done" ? "black" : "white"};
  text-align: center;
  transition: color 5s;
`;

const Header = styled.h1`
  margin: 20px auto 0 auto;
  font-size: 70px;
`;

const About = styled.p`
  margin: 0 auto 30px auto;
  font-weight: 5500px;
  font-size: 18px;
`;

const InputLabels = styled.label`
  margin: 10px;
  font-weight: 700px;
  font-size: 20px;
  color: ${props => props.status ? "black" : "white"};
  transition: color 5s;

`;

const InputLabels2 = styled(InputLabels)`
  animation: 0.4s ${fadeIn} ease-out;
`;

const InputDiv = styled.div`
  margin: 0 auto;
`;

const InputField = styled.input`
  margin: 20px;
  border: 0;
  height: 35px;
  width: 250px;
  border-radius: 5px;
`;

const InputField2 = styled(InputField)`
  animation: 0.6s ${fadeIn} ease-out;
`;

const Tutorial = styled.button`
  margin: 10px auto;
  padding: 3px;
  width: 550px;
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  font-weight: 700px;
  font-size: 20px;
  color: ${props => props.status ? "black" : "white"};
  transition: color 5s;
`;

const SubmitButton = styled.button`
  margin: 10px auto;
  width: 70px;
  padding: 7px;
  border: 0;
  border-radius: 5px;
  background-color: white;
  text-align: center;
  font-size: 16px;
  animation: 0.5s ${fadeIn} ease-out;
`;

const Error = styled.p`
  margin: 0 auto;
  max-width: 350px;
  background-color: red;
  border-radius: 5px;
  padding: 5px;
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
          duplicatesFound: 'start',
          showPopup: false
        };
        this.getAccessToken = this.getAccessToken.bind(this);
        this.handleChangeMainUsername = this.handleChangeMainUsername.bind(this);
        this.displayOtherUsers = this.displayOtherUsers.bind(this);
        this.handleChangeOtherUsername = this.handleChangeOtherUsername.bind(this);
        this.verifyUsernames = this.verifyUsernames.bind(this);
        this.displayError = this.displayError.bind(this);
        this.displayButton = this.displayButton.bind(this);
        this.submitUsernames = this.submitUsernames.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.startSongs = this.startSongs.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.findDuplicateSongs = this.findDuplicateSongs.bind(this);
        this.getDuplicatesInfo = this.getDuplicatesInfo.bind(this);
        this.displayPopup = this.displayPopup.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
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
      let value = event.target.value;
      this.setState(() => ({
        userDisplay: (value.length > 2 || this.state.userDisplay) ? true : false, 
        users: {
          ...this.state.users,
          mainUsername: value
        }
      }));
    }

    displayPopup() {
      if (this.state.showPopup) {
        return <Popup closePopup={this.togglePopup}/>
      }
    }

    togglePopup() {
      this.setState({
        showPopup: !this.state.showPopup
      })
    }

    displayOtherUsers() { //Display block for other users' inputs
      if (this.state.userDisplay === true) {
        return (
          <ContentContainer>       
            <InputLabels2 status={this.state.duplicatesFound === "done"}>Enter up to three other Spotify users to compare your music picks. Enter their URIs below:</InputLabels2>
              <InputDiv>
                <InputField2 type="text" id="username0" onChange={this.handleChangeOtherUsername}/>
                <InputField2 type="text" id="username1" onChange={this.handleChangeOtherUsername}/>
                <InputField2 type="text" id="username2" onChange={this.handleChangeOtherUsername}/>
              </InputDiv>
          </ContentContainer>
        )  
      }
    }

    displayButton() { //Display submit button
    let users = Object.keys(this.state.users);
    if (users.length > 1) {
      return (
        <SubmitButton type="submit" status={this.state.userDisplay2} onClick={this.submitUsernames}>Submit</SubmitButton>
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
        if (mainUsername === "" || mainUsername === null || mainUsername === '') {
          this.setState({
            errors: {
              ...this.state.errors,
              noMainUsername: true
            }
          })
          return
        } 

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
      if (this.state.errors.invalidUserID) {
        return (
          <div>       
            <Error>Please enter a valid username.</Error>
          </div>
        )  
      } else if (this.state.errors.minimumUsersError) {
        return (
          <div>       
            <Error>Please enter at least two usernames.</Error>
          </div>
        )
      } else if (this.state.errors.noPublicPlaylists) {
        let noPublicUser = this.state.errors.noPublicPlaylists.true;
        return (
          <div>
            <Error>Uh oh! Unfortunately {this.state.usernames[noPublicUser]} (username: {this.state.errors.noPublicPlaylists.true}) does not have any public playlists available so we are not able to compare your playlists. Please remove their username and try again.</Error>
          </div>
        )
      } else if (this.state.errors.noMainUsername) {
        return (
          <div>
            <Error>Please make sure to list your username or a main username.</Error>
          </div>
        )
      }
    }

    /*    Request user, playlist, and song data from Spotify API    */
    async submitUsernames() { //MAIN FUNCTION, start API request process
      await this.reset();
      await this.verifyUsernames();
      if (this.state.errors.invalidUserID === false && this.state.errors.minimumUsersError === false) {
        this.setState({
          duplicatesFound: 'loading'
        })
        try {
          let compareSongs = [];
          let users = Object.keys(this.state.usernames);
          for (let user of users) {
            let songs = await this.getUserData(user); //gets user data and filters our users' duplicate songs (i.e., user added the same song to multiple playlists);
            compareSongs.push(songs);
          };
          await this.findDuplicateSongs(compareSongs); 
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
          console.log(data);
          if (data.items.length === 0) {
            this.setState({
              ...this.state,
              duplicatesFound: "start",
              errors: {
                ...this.state.errors,
                noPublicPlaylists: {
                  true: user
                }
              }
            })
            return
          }
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
      console.log(arrays);
      let duplicates = _.intersection(...arrays);
      _.pull(duplicates, null);

      if (duplicates.length === 0) {
        this.setState({
          ...this.state,
          duplicateData: "none",
          duplicatesFound: "start"
        })
        return
      }

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
          duplicatesFound: 'done'
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
        duplicatesFound: 'start',  
        showPopup: false
      })
    }

    /*    Render    */
    render () {
      return (
          <Wrapper>
            <GlobalStyle/>
            <Gradient color="linear-gradient(to bottom right, #00ff33 0%, #13a9bb 50%, #7d00aa 100%)" status={this.state.duplicatesFound === "start"}/>
            <Gradient color="linear-gradient(to bottom right, #13a9bb 0%, #7d00aa 50%, #f31f69 100%)" status={this.state.duplicatesFound === "loading"}/>
            <Gradient color="linear-gradient(to bottom right, #f31f69 0%, #fe7634 50%, #f9df2f 100%)" status={this.state.duplicatesFound === "done"}/>
              <ContentContainer status={this.state.duplicatesFound}> 
                <Header>Welcome to Music Matcher!</Header>
                <About>Find out which songs you and your friends have in common in your public playlists in Spotify!</About>
                <InputLabels htmlFor="your_username" status={this.state.duplicatesFound === "done"}>Enter your Spotify username/Spotify URI here:</InputLabels>
                <InputDiv>
                  <InputField type="text" id="your_username" onChange={this.handleChangeMainUsername}/>
                </InputDiv>
                {this.displayOtherUsers()}
                {this.displayError()}
                {this.displayPopup()}
                <Tutorial onClick={this.togglePopup}>Not sure how to find a Spotify username? Click here for help!</Tutorial>
                {this.displayPopup}
              </ContentContainer>
              <DisplayData data={this.state}/>
          </Wrapper>
      );
    }
};

export default Home;