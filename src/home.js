import React from 'react';
import Header from './header';
import Menu from './menu';
import DisplaySongs from './displaysongs';
import TopArtists from './topartists';
import QueryString from 'querystring';
import _ from 'lodash';
import styled, { keyframes } from 'styled-components';
import Popup from './instructions';
import GlobalStyle from './globalStyles';
import { connect } from 'react-redux';
import { 
  setMainUser,
  setUsers,
  setStatus,
  setSongs,
  setLength,
  setArtists,
  setTopArtists
} from './redux/actions';

//Styles for gradient background
const GradientWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(256, 256, 256, 0.02);
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

//Styles for body
const Body = styled.div`
  height: calc(100% - 57px);
  width: 100%;
  padding-top: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body2 = styled(Body)`
  padding-top: 75px;
  flex-wrap: wrap;
  justify-content: center;
`;

//Styles for username input on start page
const UserInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: color 5s;
`;

const InputLabels = styled.label`
  margin: 10px;
  font-weight: 600;
  font-size: 20px;
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
  animation: 0.4s ${fadeIn} ease-out;
`;

const Tutorial = styled.button`
  margin: -2px auto 7px auto;
  padding: 3px;
  width: 550px;
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  font-weight: 500;
  font-size: 15px;
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
  animation: 0.4s ${fadeIn} ease-out;
`;

//Styles for error
const Error = styled.p`
  margin: 0 auto;
  max-width: 350px;
  background-color: red;
  border-radius: 5px;
  padding: 5px;
`;

//Styles for loader
const Loader = styled.div`
  margin: 30px auto;
  width: 100%;
  animation: 1s ${fadeIn} ease-out;
`;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          duplicateSongs: [],
          errors: {},
          showPopup: false,
          topArtists: [],
          userDisplay: false,
          users: {
            mainUsername: ''
          }         
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
        this.displayPopup = this.displayPopup.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.findTopArtists = this.findTopArtists.bind(this);
        this.getArtistArt = this.getArtistArt.bind(this);
        this.reset = this.reset.bind(this);
        this.renderContent = this.renderContent.bind(this);
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
        localStorage.setItem('accessToken', data.access_token);
      }).catch((err) => {
        console.log(err);
      })
    }

    /*    Handle user ID input, the input display, and verifying usernames    */
    handleChangeMainUsername(input) { //Set state with main username input and decide whether to other other users' block
      this.setState(() => ({
        userDisplay: (input.length > 2 || this.state.userDisplay) ? true : false, 
        users: {
          ...this.state.users,
          mainUsername: input
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
          <UserInputContainer>       
            <InputLabels2>Enter up to three other Spotify usernames to compare your music picks:</InputLabels2>
            <InputDiv>
              <InputField2 type="text" id="username0" onChange={this.handleChangeOtherUsername}/>
              <InputField2 type="text" id="username1" onChange={this.handleChangeOtherUsername}/>
              <InputField2 type="text" id="username2" onChange={this.handleChangeOtherUsername}/>
            </InputDiv>
            <SubmitButton type="submit" status={this.state.userDisplay2} onClick={this.submitUsernames}>Submit</SubmitButton>
          </UserInputContainer>
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
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
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
      let displaynames = Object.values(this.props.usernames); //Verify usernames (no undefined display names)
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
        this.props.setMainUser(this.state.mainUsername);
        this.props.setUsers(this.state.usernames);
        this.props.setStatus('loading');
        try {
          let compareSongs = [];
          let users = Object.keys(this.props.usernames);
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
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
          });
          let data = await response.json();
          if (data.items.length === 0) {
            this.setState({
              ...this.state,
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
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
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

      if (duplicates.length === 0) {
        this.props.setSongs('none');
        return
      }

      let allDuplicateInfo = [];
      let topArtists = {};

      while(duplicates.length) {
        let splitDuplicates = duplicates.splice(0,50);
        let apiDuplicates = splitDuplicates.join(",");
        let duplicateInfo = await this.getDuplicatesInfo(apiDuplicates);

        for (let song of duplicateInfo.tracks) {
          let artistsName = [];
          for (let artist of song.artists) {
            artistsName.push(artist.name);
            topArtists[artist.id] = topArtists[artist.id] ? [artist.name, (topArtists[artist.id][1] + 1)] : [artist.name, 1];
          };

          allDuplicateInfo.push(
            { "songID": song.id,
              "name": song.name,
              "artist": artistsName.join(", "),
              "image": song.album.images[1].url,
              "albumName": song.album.name
            }
          ); 
        };
      }
      this.props.setSongs(allDuplicateInfo);
      this.props.setLength(allDuplicateInfo.length);

      this.findTopArtists(topArtists);
    }

    async getDuplicatesInfo(duplicates) { //API request for song data (title, artist, album data, etc.)   
      try {
        let response = await fetch('https://api.spotify.com/v1/tracks/?ids=' + duplicates, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });
        return await response.json();
        } catch (err) {
          console.log(err);
        }
    }

    /*    Find artists data and top artists    */
    async findTopArtists(artists) {
      let duplicateArtists = [];
  
      for (const key in artists) {
        duplicateArtists.push([key, artists[key][0], artists[key][1]]);
      }
              
      let sorted = duplicateArtists.sort((a, b) => b[2] - a[2]);

      this.props.setArtists(sorted);

      let topArtists = [];

      if (sorted.length === 1) {
        topArtists.push(sorted[0]);
      } else if (sorted[0][2] !== sorted[1][2]) {
        topArtists.push(sorted[0]);
      } else if (sorted[1][2] !== sorted[2][2]) {
        topArtists.push(sorted[0], sorted[1]);
      } else if (sorted[2][2] !== sorted[3][2]) {
        topArtists.push(sorted[0], sorted[1], sorted[2])
      } else {
        return 'there really isn\'t a top artist'
      }

      let newTopArtists = []; 

      for (const artist of topArtists) {
        let image = await this.getArtistArt(artist[0]);
        newTopArtists.push([artist[0], artist[1], image]);
      }

      this.props.setTopArtists(newTopArtists);
      this.props.setStatus('data set');
    }

    getArtistArt = async (artist) => {
      let url = `https://api.spotify.com/v1/artists/${artist}`
      try {
        let response = await fetch(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
        });
        let data = await response.json();
        
        return data.images[2].url;
  
      } catch(err) {
          console.error(err);
      };   
    }

    /*    Reset functions    */
    async reset() {
      this.setState({
        users: this.state.users,
        userDisplay: true,
        mainUsername: '',
        usernames: {},
        errors: {}, 
        showPopup: false
      })
    }

    /*    Render    */
    renderContent() {
      if (this.props.status === "start") {
        return (
          <div>
            <UserInputContainer> 
              <InputLabels htmlFor="your_username" >Enter your Spotify username here:</InputLabels>
              <Tutorial onClick={this.togglePopup}>Not sure how to find a Spotify username? <span>Click here for help!</span></Tutorial>
              <InputDiv>
                <InputField 
                  type="text" 
                  id="your_username" 
                  onChange={e => this.handleChangeMainUsername(e.target.value)}
                />
              </InputDiv>
              {this.displayOtherUsers()}
              {this.displayError()}
              {this.displayPopup()}
            </UserInputContainer>
        </div>
        )
      } else if (this.props.status === "loading") {
        return (
          <Loader>
            <div className="la-line-scale-pulse-out la-dark la-2x">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
          </Loader>
        )
      } else if (this.props.status === "data set") {
        return (
          <Body2>
            <DisplaySongs/>
            <TopArtists data={this.state}/>
          </Body2>
        )
      } else {
        return <div></div>
      }
    };
    
    render () {
      return (
        <GradientWrapper>
          <GlobalStyle/>
          <Header/>
          <Gradient color="linear-gradient(to bottom right, #00ff33, #13a9bb)" status={this.props.status === "start"}/>
          <Gradient color="linear-gradient(to bottom right, #13a9bb, #7d00aa)" status={this.props.status === "loading"}/>
          <Gradient color="linear-gradient(to bottom right, #7d00aa, #fa3378)" status={this.props.status === "data set"}/>
          <Body>
            {this.renderContent()}
          </Body>
        </GradientWrapper>
      );
    }
};

function mapStateToProps(state) {
  return {
    mainUsername: state.mainUsername,
    usernames: state.usernames,
    status: state.status,
    duplicateSongs: state.duplicateSongs,
    duplicateArtists: state.duplicateArtists,
    topArtists: state.topArtists
  };
}

const mapDispatchToProps = {
  setMainUser,
  setUsers,
  setStatus,
  setSongs,
  setLength,
  setArtists,
  setTopArtists
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);