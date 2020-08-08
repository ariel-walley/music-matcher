import React from 'react';
import styled from 'styled-components';

class TopArtists extends React.Component {
  constructor(props) {
    super(props);        
    this.renderData = this.renderData.bind(this);
    this.findTopArtists = this.findTopArtists.bind(this);
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

  renderData() {
    if (this.props.data.duplicatesFound === "done") {  
      let sorted = this.findTopArtists();
      return(
        <div>
          <p>Your artist you have most in common is {sorted[0]}</p>
          <p>Your arist you have next most in common is {sorted[1]}</p>
          <p>Your arist you have next most in common is {sorted[2]}</p>
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