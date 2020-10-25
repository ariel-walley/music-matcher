import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const Heading = styled.h1`
  text-align: center;
  margin: 20px;
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
  padding: 15px;
  margin: 5px auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

const ArtistName = styled.h1`
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

const Row = styled.div`
  background-color: green;
  border-radius: 5px;
  width: 70%;
  padding: 15px;
  margin: 5px auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

const Header = styled(Row)`
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

class TopArtists extends React.Component {
  constructor(props) {
    super(props);        
    this.findTopArtists = this.findTopArtists.bind(this);
    this.formatCard = this.formatCard.bind(this);
    this.getArtistArt = this.getArtistArt.bind(this);
    this.assembleTable = this.assembleTable.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  findTopArtists() {
    let topArtists = [];

    for (const key in this.props.data.duplicateArtists) {
      topArtists.push([key, this.props.data.duplicateArtists[key][0], this.props.data.duplicateArtists[key][1]]);
    }
    
    let sorted = topArtists.sort((a, b) => b[2] - a[2]);

    return sorted;
  }

  formatCard(sorted) {
    let topArtists = [];
    
    if (sorted[0][2] !== sorted[1][2]) {
      topArtists.push(sorted[0]);
    } else if (sorted[1][2] !== sorted[2][2]) {
      topArtists.push(sorted[0], sorted[1]);
    } else if (sorted[2][2] !== sorted[3][2]) {
      topArtists.push(sorted[0], sorted[1], sorted[2])
    } else {
      return 'there really isn\'t a top artist'
    }

    let display = [];

    topArtists.map(async (artist) => {
      let image = await this.getArtistArt(artist[0]);
      
      display.push(
      <Card key={artist[0]}>
          <Img src={image} />
          <ArtistName>{artist[1]}</ArtistName>
      </Card>); 

      console.log(display);
    });
    return display;
  }

  getArtistArt = async (artist) => {
    let url = `https://api.spotify.com/v1/artists/${artist}`
    try {
      let response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + this.props.data.accessToken
        },
      });
      let data = await response.json();
      
      return data.images[2].url;

    } catch(err) {
        console.error(err);
    };   

  }


  assembleTable(artists) {
    let display = [];

    display.push(
      <Header key="header">
        <TableArtist>Artist</TableArtist>
        <TableData>No. of Songs</TableData>
        <TableData>Percent of Songs</TableData>
      </Header>
    )

    for (let artist of artists) {
      display.push(
        <Row key={artist[0]}>
          <TableArtist>{artist[1]}</TableArtist>
          <TableData>{artist[2]}</TableData>
          <TableData>{((artist[2]/this.props.data.duplicatesLength)*100).toFixed(2) + "%"}</TableData>
        </Row>      
      )
    }

    return display;

  }

  renderData() {
    if (this.props.data.duplicatesFound === "done") {  
      let sorted = this.findTopArtists();
      return(
        <MainContainer>
          <Heading>Here are your top artists in common:</Heading>
          <CardContainer>
            {this.formatCard(sorted)}
          </CardContainer>
          <Heading>See all of your artist(s) in common:</Heading>
          {this.assembleTable(sorted)}
        </MainContainer>
      )
    } else {
      return (
        <div></div>
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

export default TopArtists;