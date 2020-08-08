import React from 'react';
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";

class TopArtists extends React.Component {
  constructor(props) {
    super(props);        
    this.renderData = this.renderData.bind(this);
    this.findTopArtists = this.findTopArtists.bind(this);
    this.assembleChart = this.assembleChart.bind(this);
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

  assembleChart(artists) {
    const columns = ["Artist", "Songs in Common", "Percentage"];

    const data = [];

    for (let artist of artists) {
      data.push([artist[0], artist[1], ((artist[1]/this.props.data.duplicatesLength)*100) + "%"])
    }

    console.log(data);

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
        <div>
          {this.assembleChart(sorted)};
        </div>
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