import React from 'react';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Reset from './reset';
import { connect } from 'react-redux';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
  animation: 1s ${fadeIn} ease-out;
`;

const Header = styled.h1`
  margin: 20px;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
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
  font-size: 24px;
  font-weight: 700px;
  margin: 0 0 10px 25px;
  padding: 0;
`;

const Artist = styled.h2`
  font-size: 20px;
  font-weight: 550px;
  margin: 0 0 0 25px;
  padding: 0;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;

class DisplaySongs extends React.Component {
  constructor(props) {
    super(props);        
    this.formatHeader = this.formatHeader.bind(this);
    this.formatCard = this.formatCard.bind(this);
    }

  formatHeader() {
    // Determine the display names
    let mainUserID = this.props.mainUsername;
    let mainUsername = this.props.usernames[mainUserID];
    let usernames = Object.values(this.props.usernames);

    _.pull(usernames, mainUserID, mainUsername); // Remove the main user from the display names
    if (usernames.length === 1) {
      usernames = ' and ' + usernames
    } else if (usernames.length === 2) {
      usernames = `, ${usernames[0]} and ${usernames[1]}`
    } else {
      usernames = `, ${usernames[0]}, ${usernames[1]}, and ${usernames[2]}`
    }
    
    if (this.props.status === 'data set') {
      // Determine how many songs in common
      let songs = '';
      if (this.props.duplicateSongs === "none") {
        songs = 'no songs'
      } else if (this.props.duplicateSongs.length === 1) {
        songs = '1 song'
      } else {
        songs = `${this.props.duplicateSongs.length} songs`
      }

      // Final phrase
      return <Header>You{usernames} have {songs} in common!</Header>
    }
  }

  formatCard() {
    let display = [];

    if (this.props.status === 'data set') {
      this.props.duplicateSongs.forEach((duplicate) => {
        display.push(
        <Card key={duplicate.songID}>
          <Img src={duplicate.image} alt={`The cover art of the song's album, "${duplicate.albumName}"`}/>
          <div>
            <SongTitle>{duplicate.name}</SongTitle>
            <Artist> by {duplicate.artist}</Artist>
          </div>
        </Card>);
      })
      return display;
    } else {
      return <div></div>
    }
  }
     
  render() {
    if (this.props.duplicateSongs === 'none') {
      return(
        <div>
          {this.formatHeader()}
          <Reset margin="100px 0 0 0" function={this.props.function} />
        </div>
      )
    } else if (this.props.duplicateSongs.length > 0) {
      return (
        <MainContainer>
          {this.formatHeader()}
          <Reset margin="30px" function={this.props.function} />
          <CardContainer>
            {this.formatCard()}
          </CardContainer>
        </MainContainer>
      )
    } else {
      return <div></div>
    }
  }
}

function mapStateToProps(state) {
  return {
    mainUsername: state.mainUsername,
    usernames: state.usernames,
    status: state.status,
    duplicateSongs: state.duplicateSongs
  };
}

export default connect(mapStateToProps)(DisplaySongs);