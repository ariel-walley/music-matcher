import React, { useEffect, useState} from 'react';
import MainHeader from './components/header';
import StartPage from './startPage';
import LoadingPage from './components/loadingPage';
import DisplaySongs from './components/displaySongs';
import TopArtists from './components/topArtists';
import QueryString from 'querystring';
import _ from 'lodash';
import styled from 'styled-components';
import GlobalStyle from './styles/globalStyles';

// Styles for gradient background
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

// Styles for body
const Body = styled.div`
  height: calc(100% - 57px);
  width: 100%;
  padding-top: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body2 = styled(Body)`
  padding-top: 25px;
  flex-wrap: wrap;
`;

export default function Home() {
  const [errors, toggleErrors] = useState({
    NotMinUsers: false,
    NoMainUser: false,
    InvalidID: false,
    InvalidIDInfo: '',
    NoPublicPlaylists: false,
    NoPublicInfo: ''
  })
  const [mainUsername, setMainUsername] = useState('');
  const [usernames, setUsernames] = useState({});
  const [status, setState] = useState('start');
  const [status2, setStatus2] = useState('');

  useEffect(() => {
    const fetchAccessToken = async() => {
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

    fetchAccessToken();
  }, [])

  /*    Render    */
  const renderContent = () => {
    if (status === "start") {
      const errorsState = { errors, toggleErrors};
      const mainUsernameState = { mainUsername, setMainUsername };
      const usernamesState = { usernames, setUsernames };
    
      return <StartPage 
        /* fetchRetry={fetchRetry} */
        errorsState={errorsState}
        mainUsernameState={mainUsernameState}
        usernamesState={usernamesState}
      />
    } else {
      return <LoadingPage status2={status2}/>
    /*} else if (status === "data set") { 
      return (
        <Body2>
          <DisplaySongs function={this.reset} status={status} duplicateSongs={this.state.duplicateSongs}/>
          <TopArtists 
            status={status} 
            duplicateArtists={this.state.duplicateArtists} 
            duplicateSongs={this.state.duplicateSongs} 
            topArtists={this.state.topArtists}
          />
        </Body2>
      ) */
    } 
  };

  return (
    <GradientWrapper>
      <GlobalStyle/>
      <MainHeader /* function={reset}*//>
      <Gradient color="linear-gradient(to bottom right, #00ff33, #13a9bb)" status={status === "start"}/>
      <Gradient color="linear-gradient(to bottom right, #13a9bb, #7d00aa)" status={status === "loading"}/>
      <Gradient color="linear-gradient(to bottom right, #7d00aa, #fa3378)" status={status === "data set"}/>
      <Body>
        {renderContent()}
      </Body>
    </GradientWrapper>
  )
}

class Home2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          duplicateArtists: [],
          duplicateSongs: [],
          ErrorMinUsers: false,
          ErrorNoMain: false,
          ErrorInvalidID: false,
          ErrorNoPublicPlaylists: false,
          ErrorNoPublicInfo: '',
          mainUsername: '',
          status: 'start',
          status2: '',
          topArtists: [],
          usernames: {},
          users: {
            mainUsername: ''
          }                   
        };

        this.submitUsernames = this.submitUsernames.bind(this);
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
        this.startSongs = this.startSongs.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.findDuplicateSongs = this.findDuplicateSongs.bind(this);
        this.getDuplicatesInfo = this.getDuplicatesInfo.bind(this);
        this.findTopArtists = this.findTopArtists.bind(this);
        this.getArtistArt = this.getArtistArt.bind(this);
        this.fetchRetry = this.fetchRetry.bind(this);
        this.retryDelay = this.retryDelay.bind(this);
        this.reset = this.reset.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    async submitUsernames() {  /* CORE FUNCTION */
     
      this.setState((state, props) => ({ // Resets from last submission
        ...this.state,
        ErrorMinUsers: false,
        ErrorNoMain: false,
        ErrorInvalidID: false,
        ErrorNoPublicPlaylists: false,
        ErrorNoPublicInfo: '',
        usernames: {}
      }))

      //await this.verifyUsernames(); 

      if (!this.state.ErrorMinUsers && !this.state.ErrorNoMain && !this.state.ErrorInvalidID) {
        this.props(this.state.mainUsername);
        this.props.setUsers(this.state.usernames);  
        let users = Object.keys(this.props.usernames);      

        let userDataObject = {}

        for (let user of users) { // Fetch users' playlist IDs
          
          if (this.state.ErrorNoPublicPlaylists) {
            return
          } else {
            let userPlaylists = await this.getUserPlaylists(user);
            userDataObject[user] = (userPlaylists);
          }
        }
      
        if (this.state.ErrorNoPublicPlaylists) { // Check all users have a public playlist
          return
        } else {
          this.setState({ status: 'loading'});
        }

        for (let user of Object.keys(userDataObject)) { // Fetch the songs for each playlist
          this.setState({status2: 'Requesting songs for ' + this.state.usernames[user] + '...'});

          let userSongs = await this.startSongs(userDataObject[user]);
          let uniqUserSongs = _.uniq(userSongs); // In case a user has the same song on multiple playlists, preventing false duplicates
          userDataObject[user] = (uniqUserSongs);
        }

        await this.findDuplicateSongs(userDataObject); // Find duplicate songs and top artists

      } 
    }

    async getUserPlaylists(user) { // Requests user's playlists IDs
      let playlists = [];
      let next = `https://api.spotify.com/v1/users/${user}/playlists?limit=50`;
      while(next != null) {
        let response = await fetch(next, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
        });

        let data = await response.json();

        while (Object.keys(data)[0] === "error" && data.error.status === 429) { // Handle rate limiting
          data = await this.fetchRetry(response, next);
        }

        if (data.total === 0) { // If a user has no public playlists to compare, set an error in state
          this.setState({
            ErrorNoPublicPlaylists: true,
            ErrorNoPublicInfo: user
          })
          return
        } else { // If a user does have public playlists, create an array with all of their playlists IDs
          let playlistsChunk = data.items.map(playlist => { return playlist.id });
          playlists.push(...playlistsChunk);
          next = data.next;
        }
      } 
      return playlists;
    }

    async startSongs (playlists) { // Loops through playlists to send off requests for each playlists' songs
      let usersSongs = [];
      for(let playlistID of playlists) {
        let playlistData = await this.fetchSongs(playlistID);
        usersSongs.push(playlistData);
      }
      return usersSongs.flat();
    }

    async fetchSongs(playlistID) { // Requests playlists' songs
      let playlistSongs = [];
      let next = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track(id,name,album(images,name),artists(name))),limit,next,offset,previous,total`

      while(next !=null) {
        let response = await fetch(next, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });
        
        let data = await response.json();
        
        while (Object.keys(data)[0] === "error" && data.error.status === 429) { // Handle rate limiting
          data = await this.fetchRetry(response, next);
        }

        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].track !== null) { 
            playlistSongs.push(data.items[i].track.id);
          }
        }

        next = data.next;
      }
      return playlistSongs;
    }

    async findDuplicateSongs(object) { // Find duplicates data and set in state
      let arrays = Object.values(object);
      let duplicates = _.intersection(...arrays);
      _.pull(duplicates, null);

      if (duplicates.length === 0) {
        this.setState({duplicateSongs: 'none', status: 'data set'});
      } else {

        this.setState({status2: 'Finding duplicates...'});
        
        let duplicateSongs = []; // Will hold the duplicate song data
        let duplicateArtists = {}; // Will tally how many times an artist is found among the duplicate songs

        while(duplicates.length) { 
          let prepareDuplicates = duplicates.splice(0,50).join(","); // Divide songs into sets of 50 for the API request
          let duplicateInfo = await this.getDuplicatesInfo(prepareDuplicates);

          for (let song of duplicateInfo.tracks) { // For each duplicate song...
            let artistsName = []; 
            for (let artist of song.artists) {
              artistsName.push(artist.name); // Gather all artists for each track
              duplicateArtists[artist.id] = duplicateArtists[artist.id] ? [artist.name, (duplicateArtists[artist.id][1] + 1)] : [artist.name, 1]; // Add to the artist tally for all duplicate songs 
            };

            duplicateSongs.push(
              { "songID": song.id,
                "name": song.name,
                "artist": artistsName.join(", "),
                "image": song.album.images[1].url,
                "albumName": song.album.name
              }
            ); 
          };
        }
        
        duplicateSongs.sort((a, b) => {
          let artistLocale = a.artist.localeCompare(b.artist, undefined, {sensitivity: 'base'});
          let nameLocale = a.name.localeCompare(b.name, undefined, {sensitivity: 'base'});
          
          // Sort alphabetically by artist and then, if same artist, by song title
          if (artistLocale > 0) {
            return 1
          } else if (artistLocale === 0) {
            if (nameLocale > 0) {
              return 1
            } else if (nameLocale === 0) {
              return 0
            } else {
              return -1
            }
          } else {
            return -1
          }
        })

        this.setState({duplicateSongs: duplicateSongs});

        if (Object.keys(duplicateArtists).length > 5) {
          this.findTopArtists(duplicateArtists);
        }  

        this.setState({status: 'data set'});
      }
    }

    async getDuplicatesInfo(duplicates) { // API request for song data (title, artist, album art, etc.) 
      let url = 'https://api.spotify.com/v1/tracks/?ids=' + duplicates;
      let response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      let data = await response.json();

      while (Object.keys(data)[0] === "error" && data.error.status === 429) { // Handle rate limiting
        data = await this.fetchRetry(response, url);
      }

      return data;
    }

    async findTopArtists(artists) { // Find top artist(s) and set them in state
      
      this.setState({status2: 'Finding top artists...'});
 
      let duplicateArtists = [];
  
      for (const key in artists) {
        duplicateArtists.push([key, artists[key][0], artists[key][1]]); // Create a key, the artist name, and their tally
      }

      let sorted = duplicateArtists.sort((a, b) => b[2] - a[2]); // Sort by most frequently occuring to least

      this.setState({ duplicateArtists: sorted});

      let topArtistsCard = [];

      if (sorted[0][2] !== sorted[1][2]) { // Identify whether there are none, one, two, or three top artists
        topArtistsCard.push(sorted[0]);
      } else if (sorted[1][2] !== sorted[2][2]) {
        topArtistsCard.push(sorted[0], sorted[1]);
      } else if (sorted[2][2] !== sorted[3][2]) {
        topArtistsCard.push(sorted[0], sorted[1], sorted[2])
      } 
  
      let topArtistsData = []; 

      if (topArtistsCard.length > 0) {
        let topArtistsIDs = topArtistsCard.map(arr => arr[0]);
        let data = await this.getArtistArt(topArtistsIDs.join(","));

        for (const artist of data.artists) {          
          topArtistsData.push([artist.id, artist.name, artist.images[2].url]);
        }

        this.setState({ topArtists: topArtistsData});
      } 
      
      this.setState({status: 'data set'});
    }

   async getArtistArt (artist) { //API request for artist image
      let url = `https://api.spotify.com/v1/artists?ids=${artist}`
      let response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
      });
      let data = await response.json();

      while (Object.keys(data)[0] === "error" && data.error.status === 429) { // Handle rate limiting
        data = await this.fetchRetry(response, url);
      }
      
      return data;
    }

    async fetchRetry(response, url) {
      let data;
      let newResponse;

      for (var pair of response.headers.entries()) {
        if (pair[0] === "retry-after") {
          let waitTime = pair[1];
          await this.retryDelay(waitTime);

          newResponse = await fetch(url, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
          });

          data = await newResponse.json();

        }   
      }
      return data;
    }

    retryDelay(waitTime) {
      return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    /*    Reset functions    */
    async reset() {
      this.setState({
        duplicateArtists: [],
        duplicateSongs: [],
        ErrorMinUsers: false,
        ErrorNoMain: false,
        ErrorInvalidID: false,
        ErrorNoPublicPlaylists: false,
        ErrorNoPublicInfo: '',
        mainUsername: "",
        status: 'start', 
        status2: '', 
        topArtists: [],
        usernames: {},
        users: {}
      })

      this.props.setMainUser('');
      this.props.setUsers({});
    }
};