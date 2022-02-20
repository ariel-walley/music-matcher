import React from 'react';
import ArtistsTable from './artistsTable';

import * as styles from '../../styles/topArtistsStyles';
import { Heading1, Heading2 } from '../../styles/styles';

export default function TopArtists(props) {
  const formatCard = () => {
    if (props.status === 'data set') { 
      return props.topArtists.map((artist) => 
        <styles.Card key={artist[0]}>
          <styles.Img src={artist[2]} alt={`The artist art for ${artist[1]}`} />
          <Heading2>{artist[1]}</Heading2>
        </styles.Card>
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
        <styles.MainContainer>
          {createHeader()}
          <styles.CardContainer>
            {formatCard()}
          </styles.CardContainer>
          <ArtistsTable duplicateArtists={props.duplicateArtists} duplicateSongs={props.duplicateSongs}/>
        </styles.MainContainer>
      )
    } else {
      return <div></div>
    }
  }

  return render()
}