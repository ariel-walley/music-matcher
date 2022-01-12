import React from 'react';
import styled, { keyframes } from 'styled-components';
import ArtistsTable from './artistsTable';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

const MainContainer = styled.div`
  width: 100%;
  animation: 1s ${fadeIn} ease-out;
`;

const Heading = styled.h1`
  margin: 23px;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  width: 25%;
  padding: 15px;
  margin: 15px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

const ArtistName = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 10px 25px;
  padding: 0;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;

export default class TopArtists extends React.Component {
  constructor(props) {
    super(props);        
    this.formatCard = this.formatCard.bind(this);
    this.createHeader = this.createHeader.bind(this);
  }

  formatCard() {
    if (this.props.status === 'data set') { 
      return this.props.topArtists.map((artist) => 
        <Card key={artist[0]}>
          <Img src={artist[2]} alt={`The artist art for ${artist[1]}`} />
          <ArtistName>{artist[1]}</ArtistName>
        </Card>
      )
    } else {
      return <div></div>
    }
  }

  createHeader() {
    if (this.props.topArtists.length > 1) {
      return <Heading>Here are your top artists in common:</Heading>
    } else if (this.props.topArtists.length > 0) {
      return <Heading>Here is your top artist in common:</Heading>
    } else {
      return <div></div>
    }
  }

  render() {
    if (this.props.duplicateArtists.length > 5) {
      return(
        <MainContainer>
          {this.createHeader()}
          <CardContainer>
            {this.formatCard()}
          </CardContainer>
          <ArtistsTable duplicateArtists={this.props.duplicateArtists} duplicateSongs={this.props.duplicateSongs}/>
        </MainContainer>
      )
    } else {
      return <div></div>
    }
  }
}