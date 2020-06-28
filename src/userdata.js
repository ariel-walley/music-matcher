import React from 'react';

class DisplayData extends React.Component {
  constructor(props) {
    super(props);        
    this.adaptData = this.adaptData.bind(this);
    }

    adaptData() {
      if (this.props.data.loaded === false) {
        return (
          <div>
            <p>Loading...</p>
          </div>
        )
      } else {
        let display = [];
        return (
          <div>
            <h1>Here is a list of songs you have in common!</h1>
            <ul>
              { 
              this.props.data.duplicates.forEach((song) => {
                display.push(<li key={song}>{song}</li>);
              })
              }
              {display}
            </ul>
          </div>  
        )
      }
    }
          

  render() {
    return(
      <div>
        {this.adaptData()}
      </div>
    )
  }
}

export default DisplayData;