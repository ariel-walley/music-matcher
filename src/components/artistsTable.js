import React from 'react';
import styled from 'styled-components';
import { Heading1 } from '../styles/styles';

const Row = styled.div`
  background-color: green;
  border-radius: 5px;
  width: 45%;
  padding: 15px;
  margin: 10px auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

const TableHeader = styled(Row)`
  width: 45%
  text-decoration: underline;
  font-size: 20px;
  font-weight: 700;
`;

const TableData = styled.div`
  width: ${props => props.artist ? "50%" : "25%"};
  margin: auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: ${props => props.heading ? "22px" : "18px"};
`;

export default function ArtistsTable(props) {
  const assembleTable = () => {
    let display = [(
      <TableHeader key="tableHeader">
        <TableData artist heading>Artist</TableData>
        <TableData heading>No. of Songs</TableData>
        <TableData heading>Song Percentage</TableData>
      </TableHeader>
  )];

    if (props.duplicateArtists.length > 5) {
      for (let artist of props.duplicateArtists) {
        display.push(
          <Row key={artist[0]}>
            <TableData artist>{artist[1]}</TableData>
            <TableData>{artist[2]}</TableData>
            <TableData>{((artist[2]/props.duplicateSongs.length)*100).toFixed(2) + "%"}</TableData>
          </Row>
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