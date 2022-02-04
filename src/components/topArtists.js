import React from 'react';
import styled from 'styled-components';
import { fadeIn, Heading1, Heading2 } from '../styles/styles';
import ArtistsTable from './artistsTable';

const MainContainer = styled.div`
  width: 100%;
  animation: 1s ${fadeIn} ease-out;
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

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;

export default function TopArtists(props) {
  const formatCard = () => {
    if (props.status === 'data set') { 
      return props.topArtists.map((artist) => 
        <Card key={artist[0]}>
          <Img src={artist[2]} alt={`The artist art for ${artist[1]}`} />
          <Heading2>{artist[1]}</Heading2>
        </Card>
      )
    } else {
      return <div></div>
    }
  }

  const createHeader = () => {
    if (props.topArtists.length > 1) {
      return <Heading1>Here are your top artists in common:</Heading1>
    } else if (props.topArtists.length > 0) {
      return <Heading1>Here is your top artist in common:</Heading1>
    } else {
      return <div></div>
    }
  }

  const render = () => {
    if (props.duplicateArtists.length > 5) {
      return(
        <MainContainer>
          {createHeader()}
          <CardContainer>
            {formatCard()}
          </CardContainer>
          <ArtistsTable duplicateArtists={props.duplicateArtists} duplicateSongs={props.duplicateSongs}/>
        </MainContainer>
      )
    } else {
      return <div></div>
    }
  }

  return render()
}