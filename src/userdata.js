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
            <p>State not yet updated</p>
          </div>
        )
      } else {
        let display = [];

        Object.keys(this.props.data.userPlaylists).map((user) => {              
          display.push(
            <div>
              <h1 key={user}>{user}</h1>
                <ol>
                  {
                  Object.keys(this.props.data.userPlaylists[user]).map((playlist) => {
                    return (
                      <li key={user + playlist}>    
                        {playlist}
                        <ol>
                          {
                          this.props.data.userPlaylists[user][playlist].map((song) => {
                            return (
                              <li key={user + playlist + song}>{song}</li>
                            )
                          })
                          }
                        </ol>
                      </li>)
                  })
                  }
                </ol>
            </div>
          );             
        });
          
        return (
          <div>
          <p>state updated</p>
          {display}
          </div> 
        ) 
      }
    };

  render() {
    return(
      <div>
        <h1>User</h1>
        <ol>
          <li>Playlist</li>
          <ol>
            <li>Song</li>
          </ol>
        </ol>
        {this.adaptData()}
      </div>
    )
  }
}

export default DisplayData;