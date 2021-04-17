import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Heading } from './topArtists';

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

const Header = styled(Row)`
  width: 45%
  font-weight: 700;
  text-decoration: underline;
  font-size: 22px;
`;

const TableData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  margin: auto 20px;
  width: 25%;
  text-align: center;
`;

const TableArtist = styled(TableData)`
  width: 50%;
`;

class ArtistsTable extends React.Component {
  constructor(props) {
    super(props);
    this.assembleTable = this.assembleTable.bind(this);
  }

  assembleTable() {
    let display = [(
      <Header key="header">
        <TableArtist>Artist</TableArtist>
        <TableData>No. of Songs</TableData>
        <TableData>Percent of Songs</TableData>
      </Header>
  )];

    if (this.props.duplicateArtists.length > 5) {
      for (let artist of this.props.duplicateArtists) {
        display.push(
          <Row key={artist[0]}>
            <TableArtist>{artist[1]}</TableArtist>
            <TableData>{artist[2]}</TableData>
            <TableData>{((artist[2]/this.props.duplicateSongs.length)*100).toFixed(2) + "%"}</TableData>
          </Row>      
        )
      }
      return display;
    } else {
      return <div></div>
    }
  }

  render() {
    if (this.props.duplicateArtists.length > 5) {
      return(
        <div>
          <Heading>See all of your artists in common:</Heading>
          {this.assembleTable()}
        </div>  
      )
    }
  }

}

function mapStateToProps(state) {
  return {
    duplicateSongs: state.duplicateSongs,
    duplicateArtists: state.duplicateArtists
  };
}

export default connect(mapStateToProps)(ArtistsTable);