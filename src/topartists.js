import React from 'react';
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";

const MainContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const Header = styled.h1`
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

class TopArtists extends React.Component {
  constructor(props) {
    super(props);        
    this.renderData = this.renderData.bind(this);
    this.findTopArtists = this.findTopArtists.bind(this);
    this.assembleChart = this.assembleChart.bind(this);
    this.formatCard = this.formatCard.bind(this);
    //this.getArtistArt = this.getArtistArt.bind(this);
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
    let display = [];
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

    topArtists.forEach((artist) => {
      display.push(
      <Card key={artist[0]}>
          <ArtistName>{artist[1]}</ArtistName>
      </Card>); 
    });

    return display;
  }

  /* getArtistArt(artist) {
    let artists = [];

    for (key in this.props.data.duplicateArtists) {
      console.log(this.props.data.duplicateArtists[key]);
    }
    Object.values(this.props.data.duplicateArtists).
    console.log(artistID);
  } */

  assembleChart(artists) {
    const columns = ["Artist", "Songs in Common", "Percentage"];
    const data = [];

    for (let artist of artists) {
      data.push([artist[1], artist[2], ((artist[2]/this.props.data.duplicatesLength)*100).toFixed(2) + "%"])
    }

    const options = {
      filterType: 'checkbox',
    };

    return (
    <MUIDataTable 
      title={"Your Top Artists in Common"} 
      data={data} 
      columns={columns} 
      options={options} 
    />
    )
  };

  renderData() {
    if (this.props.data.duplicatesFound === "done") {  
      let sorted = this.findTopArtists();
      return(
        <MainContainer>
          <Header>Here are your top artists in common:</Header>
          <CardContainer>
            {this.formatCard(sorted)}
          </CardContainer>
          {this.assembleChart(sorted)}
        </MainContainer>
      )
    } else {
      return (
        <div>
         <p>Here are your artists in common:</p>
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

export default TopArtists;