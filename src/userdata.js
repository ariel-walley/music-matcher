import React from 'react';

class DisplayData extends React.Component {
  constructor(props) {
    super(props);        
    this.formatData = this.formatData.bind(this);
    this.renderData = this.renderData.bind(this);
    }


    formatData(){
      let display = [];
      this.props.data.duplicateData.map((duplicate) => {
        console.log(duplicate);
        console.log(duplicate.id, duplicate.name);
        display.push(
        <div>
          <li><h1 key={duplicate.id}>{duplicate.name}</h1></li><h2> by {duplicate.artist}</h2>
          <img src={duplicate.image} alt="album image"/>
        </div>); 
      })
      console.log(display);
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