import React from 'react';

import * as styles from '../../styles/artistsTableStyles';
import { Heading1 } from '../../styles/styles';

export default function ArtistsTable(props) {
  const assembleTable = () => {
    let display = [(
      <styles.TableHeader key="tableHeader">
        <styles.TableData artist heading>Artist</styles.TableData>
        <styles.TableData heading>No. of Songs</styles.TableData>
        <styles.TableData heading>Song Percentage</styles.TableData>
      </styles.TableHeader>
  )];

    if (props.duplicateArtists.length > 5) {
      for (let artist of props.duplicateArtists) {
        display.push(
          <styles.Row key={artist[0]}>
            <styles.TableData artist>{artist[1]}</styles.TableData>
            <styles.TableData>{artist[2]}</styles.TableData>
            <styles.TableData>{((artist[2]/props.duplicateSongs.length)*100).toFixed(2) + "%"}</styles.TableData>
          </styles.Row>
        )
      }
      return display;
    } else {
      return <div></div>
    }
  }

  const render = () => {
    if (props.duplicateArtists.length > 5) {
      return(
        <div>
          <Heading1>See all of your artists in common:</Heading1>
          {assembleTable()}
        </div>  
      )
    }
  }

  return render();

}