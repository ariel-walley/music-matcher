import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const MainContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  margin: 20px;
`;

const Loading = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 550px;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  justify-content: left;
`;

const Card = styled.div`
  width: 40%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  border-radius: 15px;
  padding: 18px;
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

class DisplayData extends React.Component {
  constructor(props) {
    super(props);        
    this.formatCard = this.formatCard.bind(this);
    this.renderData = this.renderData.bind(this);
    }

    formatCard() {
      let display = [];
      this.props.data.duplicateData.map((duplicate) => {
        display.push(
        <Card key={duplicate.id}>
          <Img src={duplicate.image} alt={duplicate.albumName} />
          <div>
            <SongTitle>{duplicate.name}</SongTitle>
            <Artist> by {duplicate.artist}</Artist>
          </div>
        </Card>); 
      })
      return display;
    }

    formatHeader() {
      //Determine the display names
      let mainUserID = this.props.data.mainUsername;
      let mainUsername = this.props.data.usernames[mainUserID];
      let usernames = Object.values(this.props.data.usernames);
      _.pull(usernames, mainUserID, mainUsername); //remove the main user from the display names
      if (usernames.length === 1) {
        usernames = ' and ' + usernames
      } else if (usernames.length === 2) {
        usernames = `, ${usernames[0]} and ${usernames[1]}`
      } else {
        usernames = `, ${usernames[0]}, ${usernames[1]}, and ${usernames[2]}`
      }
    
      //Determine how many songs in common
      let songs = '';
      let length = this.props.data.duplicateData.length;
      if (length === 0) {
        songs = 'no songs'
      } else if (length === 1) {
        songs = '1 song'
      } else {
        songs = `${length} songs`
      }

      //Final phrase
      return <Header>You{usernames} have {songs} in common!</Header>
    }

    renderData() {
      if (this.props.data.duplicatesFound === false) {
        return (
          <div>
            <Loading>Loading...</Loading>
          </div>
        )
      } else {
        return (
          <div>
            <MainContainer>
              {this.formatHeader()}
              <CardContainer>
                {this.formatCard()}
              </CardContainer>
            </MainContainer>
          </div>  
        )
      }
    }
      
  render() {
    return(
      <div>
        {this.renderData()}
      </div>
    )
  }
}

export default DisplayData;