import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  width: 50%;
  margin: 0 auto 10px auto;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  display: flex;
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(243,94,131,1) 17.1%, rgba(236,212,80,1) 89.7% );
  border-radius: 25px;
  padding: 18px;
`;

const SongTitle = styled.h1`
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

class DisplayData extends React.Component {
  constructor(props) {
    super(props);        
    this.formatData = this.formatData.bind(this);
    this.renderData = this.renderData.bind(this);
    }

    formatData() {
      let display = [];
      this.props.data.duplicateData.map((duplicate) => {
        display.push(
        <Div>
          <Img src={duplicate.image} alt="album image"/>
          <div>
            <SongTitle>{duplicate.name}</SongTitle>
            <Artist> by {duplicate.artist}</Artist>
          </div>
        </Div>); 
      })
      return display;
    }

    renderData() {
      if (this.props.data.duplicatesFound === false) {
        return (
          <div>
            <p>Loading...</p>
          </div>
        )
      } else {
        return (
          <div>
            <h1>Here is a list of songs you have in common!</h1>
            <ol>
              {this.formatData()}
            </ol>
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

export default DisplayData;