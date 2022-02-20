import React from 'react';
import Reset from './reset';
import _ from 'lodash';

import * as styles from '../../styles/displaySongsStyles';
import { WrapContainer, Heading1 } from '../../styles/styles'

export default function DisplaySongs(props) {
  const formatHeader = () => {
    // Determine the display names
    let mainUserID = props.mainUsername;
    let mainUsername = props.usernames[mainUserID];
    let usernames = Object.values(props.usernames);

    _.pull(usernames, mainUserID, mainUsername); // Remove the main user from the display names
    if (usernames.length === 1) {
      usernames = ' and ' + usernames
    } else if (usernames.length === 2) {
      usernames = `, ${usernames[0]} and ${usernames[1]}`
    } else {
      usernames = `, ${usernames[0]}, ${usernames[1]}, and ${usernames[2]}`
    }
    
    if (props.status === 'data set') {
      // Determine how many songs in common
      let songs = '';
      if (props.duplicateSongs === "none") {
        songs = 'no songs'
      } else if (props.duplicateSongs.length === 1) {
        songs = '1 song'
      } else {
        songs = `${props.duplicateSongs.length} songs`
      }

      // Final phrase
      return <Heading1>You{usernames} have {songs} in common!</Heading1>
    }
  }

  const formatCard = () => {
    if (props.status === 'data set') {
      return props.duplicateSongs.map((duplicate) => 
        <styles.Card key={duplicate.songID}>
          <styles.Img src={duplicate.image} alt={`The cover art of the song's album, "${duplicate.albumName}"`}/>
          <div>
            <styles.CardSongTitle>{duplicate.name}</styles.CardSongTitle>
            <styles.CardArtist> by {duplicate.artist}</styles.CardArtist>
          </div>
        </styles.Card>
      )
    } else {
      return <div></div>
    }
  }
     
  const render = () => {
    if (props.duplicateSongs === 'none') {
      return(
        <div>
          {formatHeader()}
          <Reset margin="100px 0 0 0" function={props.function} />
        </div>
      )
    } else if (props.duplicateSongs.length > 0) {
      return (
        <styles.MainContainer>
          {formatHeader()}
          <Reset margin="30px" function={props.function} />
          <WrapContainer>
            {formatCard()}
          </WrapContainer>
        </styles.MainContainer>
      )
    } else {
      return <div></div>
    }
  }

  return render();
}
