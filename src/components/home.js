import React, { useEffect, useState} from 'react';

import MainHeader from './header';
import StartPage from './start-page/startPage';
import LoadingPage from './loadingPage';
import DisplaySongs from './results-page/displaySongs';
import TopArtists from './results-page/topArtists';

import QueryString from 'querystring';
import _ from 'lodash';

import GlobalStyle from '../styles/globalStyles';
import * as styles from '../styles/homeStyles';

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
  const [status, setStatus] = useState('start');
  const [status2, setStatus2] = useState('');
  const [duplicateArtists, setDuplicateArtists] = useState([]);
  const [duplicateSongs, setDuplicateSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

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

  useEffect(() => {
    fetchPlaylists();
  }, [status]);

  /* Rate Limiting Functions */

  const retryDelay = (waitTime) => {
    return new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  const fetchRetry = async(headers, url) => {
    let data;
    let newResponse;

    for (var pair of headers.entries()) {
      if (pair[0] === "retry-after") {
        const waitTime = pair[1];
        await retryDelay(waitTime);

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

  /* API Requests */

  const requestData = async (endpoint, criteria) => {
    let next = `https://api.spotify.com/v1/${endpoint}`
    let container = [];

    while (next !== null) {
      let response = await fetch(next, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
      });

      let data = await response.json();      

      // Handle rate limiting
      while (Object.keys(data)[0] === "error" && data.error.status === 429) { 
        data = await fetchRetry(response.headers, next);
      }

      container.push(data[criteria]);

      if (data.next) {
        next = data.next
      } else {
        next = null;
      }
    }
    return container.flat();
  }

  const fetchPlaylists = async () => {
    if (status === 'fetchPlaylists') {
      let userDataObject = {}

      // Fetch users' playlist IDs
      for (const user of Object.keys(usernames)) {
        let data = await requestData(`users/${user}/playlists?limit=50`, 'items');
        // Checking for users with no public playlists
        if (data.total === 0) {
          toggleErrors({...errors, NoPublicPlaylists: true, NoPublicInfo: [...errors.NoPublicInfo, user]}); 
          return
        } else {
          userDataObject[user] = data.map(playlist => playlist.id);
        }
      }

      setStatus('loading');
      fetchSongs(userDataObject);
    }
  }

  const fetchSongs = async (userDataObject) => {
    for (let user of Object.keys(userDataObject)) { // For... loop for each user
      setStatus2('Requesting songs for ' + usernames[user] + '...');
      let userSongs = [];

      for (let playlistID of userDataObject[user]) { // For... loop for each playlist
        let data = await requestData(`playlists/${playlistID}/tracks?fields=items(track(id,name,album(images,name),artists(name))),limit,next,offset,previous,total`, 'items');
        userSongs.push(data.map(song => song.track.id).filter(Boolean));
      }

      userSongs = userSongs.flat().filter(Boolean);
      let uniqUserSongs = _.uniq(userSongs); // In case a user has the same song on multiple playlists, preventing false duplicates
      userDataObject[user] = (uniqUserSongs);
    }
    identifyDuplicateSongs(userDataObject);
  }   
  
  const identifyDuplicateSongs = async (userDataObject) => {
    let arrays = Object.values(userDataObject);
    let duplicates = _.intersection(...arrays);
    _.pull(duplicates, null);

    if (duplicates.length === 0) {
      setDuplicateSongs('none');
      setStatus('data set');
    } else {
      setStatus2('Finding duplicates...');

      let duplicateInfo = [];

      while(duplicates.length) {
        let data = await requestData(`tracks/?ids=${duplicates.splice(0,50).join(",")}`, 'tracks'); // Divide songs into sets of 50 for the API request
        duplicateInfo.push(data);
      };
      
      let duplicateSongsLocal = []; // Will hold the duplicate song data
      let duplicateArtistsLocal = {}; // Will tally how many times an artist is found among the duplicate songs

      for (let song of duplicateInfo.flat()) {
        let artistsName = []; // Gather all artists for each track
        for (let artist of song.artists) {
          artistsName.push(artist.name); 
          duplicateArtistsLocal[artist.id] = duplicateArtistsLocal[artist.id] ? [artist.name, (duplicateArtistsLocal[artist.id][1] + 1)] : [artist.name, 1]; // Add to the artist tally for all duplicate songs 
        };

        duplicateSongsLocal.push(
          { "songID": song.id,
            "name": song.name,
            "artist": artistsName.join(", "),
            "image": song.album.images[1].url,
            "albumName": song.album.name
          }
        ); 
      }
      
      duplicateSongsLocal.sort((a, b) => {
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

      setDuplicateSongs(duplicateSongsLocal);

      if (Object.keys(duplicateArtistsLocal).length > 5) {
        identifyDuplicateArtists(duplicateArtistsLocal);
      } else {
        setStatus('data set');
      }
    }
  }

  const identifyDuplicateArtists = async (artists) => {
    setStatus('Finding top artists...');

    let duplicateArtists = [];

    for (const key in artists) {
      duplicateArtists.push([key, artists[key][0], artists[key][1]]); // Create a key, the artist name, and their tally
    }

    let sorted = duplicateArtists.sort((a, b) => b[2] - a[2]); // Sort by most frequently occuring to least

    setDuplicateArtists(sorted);
    identifyTopArtists(sorted);
  }  

  const identifyTopArtists = async (sorted) => {
    let topArtistsCard = [];

    if (sorted[0][2] !== sorted[1][2]) { // Identify whether there are none, one, two, or three top artists
      topArtistsCard = [sorted[0]];
    } else if (sorted[1][2] !== sorted[2][2]) {
      topArtistsCard = [sorted[0], sorted[1]];
    } else if (sorted[2][2] !== sorted[3][2]) {
      topArtistsCard = [sorted[0], sorted[1], sorted[2]];
    } 

    if (topArtistsCard.length > 0) {
      let topArtistsIDs = topArtistsCard.map(arr => arr[0]);
      let data = await requestData(`artists?ids=${topArtistsIDs.join(",")}`, 'artists');
      let topArtistsData = data.map(artist => [artist.id, artist.name, artist.images[2].url]);
      setTopArtists(topArtistsData);
    } 
    
    setStatus('data set');
  }

  /*    Render    */
  const renderContent = () => {
    if (status === 'start' || status === 'fetchPlaylists') {
      const errorsState = { errors, toggleErrors};
      const mainUsernameState = { mainUsername, setMainUsername };
      const usernamesState = { usernames, setUsernames };
    
      return <StartPage 
        fetchRetry={fetchRetry}
        errorsState={errorsState}
        mainUsernameState={mainUsernameState}
        usernamesState={usernamesState}
        setStatus={setStatus}
        reset={reset}
      />
    } else if (status === 'loading') {
      return <LoadingPage status2={status2}/>
    } else if (status === 'data set') { 
      return (
        <styles.Body2>
          <DisplaySongs function={reset} status={status} duplicateSongs={duplicateSongs} mainUsername={mainUsername} usernames={usernames}/>
          <TopArtists 
            status={status} 
            duplicateArtists={duplicateArtists} 
            duplicateSongs={duplicateSongs} 
            topArtists={topArtists}
          />
        </styles.Body2>
      )
    } 
  };

  const reset = () => {
    toggleErrors({
      NotMinUsers: false,
      NoMainUser: false,
      InvalidID: false,
      InvalidIDInfo: '',
      NoPublicPlaylists: false,
      NoPublicInfo: ''
    })
    setMainUsername('');
    setUsernames({});
    setStatus('start');
    setStatus2('');
    setDuplicateArtists([]);
    setDuplicateSongs([]);
    setTopArtists([]);
  }

  return (
    <styles.GradientWrapper>
      <GlobalStyle/>
      <MainHeader function={reset}/>
      <styles.Gradient color="linear-gradient(to bottom right, #00ff33, #13a9bb)" status={status === "start" || status === 'fetchPlaylists'}/>
      <styles.Gradient color="linear-gradient(to bottom right, #13a9bb, #7d00aa)" status={status === "loading"}/>
      <styles.Gradient color="linear-gradient(to bottom right, #7d00aa, #fa3378)" status={status === "data set"}/>
      <styles.Body>
        {renderContent()}
      </styles.Body>
    </styles.GradientWrapper>
  )
}