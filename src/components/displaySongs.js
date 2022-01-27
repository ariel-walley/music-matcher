import React from 'react';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Reset from './reset';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  animation: 1s ${fadeIn} ease-out;
`;

const Heading = styled.h1`
  margin: 20px;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  width: 30%;
  padding: 15px;
  margin: 15px 40px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

const SongTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 7px 25px;
  padding: 0;
`;
 
const Artist = styled.h2`
  font-size: 20px;
  margin: 0 0 0 25px;
  padding: 0;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;

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
      return <Heading>You{usernames} have {songs} in common!</Heading>
    }
  }

  const formatCard = () => {
    if (props.status === 'data set') {
      return props.duplicateSongs.map((duplicate) => 
        <Card key={duplicate.songID}>
          <Img src={duplicate.image} alt={`The cover art of the song's album, "${duplicate.albumName}"`}/>
          <div>
            <SongTitle>{duplicate.name}</SongTitle>
            <Artist> by {duplicate.artist}</Artist>
          </div>
        </Card>
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
        <MainContainer>
          {formatHeader()}
          <Reset margin="30px" function={props.function} />
          <CardContainer>
            {formatCard()}
          </CardContainer>
        </MainContainer>
      )
    } else {
      return <div></div>
    }
  }

  return render();
}
