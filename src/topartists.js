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
  }

  findTopArtists() {
    let result = {};
    this.props.data.duplicateArtists.forEach(function (v, i) {
      result[v] = result[v] ? [...result[v], i] : [i];
    });

    let newResult = {};
    Object.keys(result).forEach((artist) => {
      newResult[artist] = result[artist].length
    })

    let entries = Object.entries(newResult);
    let sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted;
  }

  formatCard(sorted) {
    let display = [];
    let topArtists = [];
    
    if (sorted[0][1] !== sorted[1][1]) {
      topArtists.push(sorted[0]);
    } else if (sorted[1][1] !== sorted[2][1]) {
      topArtists.push(sorted[0], sorted[1]);
    } else if (sorted[2][1] !== sorted[3][1]) {
      topArtists.push(sorted[0], sorted[1], sorted[2])
    } else {
      return 'there really isn\'t a top artist'
    }

    topArtists.map((artist) => {
      display.push(
      <Card key={artist[0]}>
          <ArtistName>{artist[0]}</ArtistName>
      </Card>); 
    });

    return display;
  }

  assembleChart(artists) {
    const columns = ["Artist", "Songs in Common", "Percentage"];
    const data = [];

    for (let artist of artists) {
      data.push([artist[0], artist[1], ((artist[1]/this.props.data.duplicatesLength)*100) + "%"])
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