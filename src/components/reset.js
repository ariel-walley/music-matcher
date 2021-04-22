import React from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import styled from 'styled-components';

const ResetContainer = styled.div`
  margin: ${props => props.margin};
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const ResetText = styled.p`
  margin: 0 0 0 10px;
  font-size: 1.5em;
  font-weight: bold;
`;

class Reset extends React.Component {
  render () {
    return(
      <ResetContainer onClick={this.props.function}>
        <ReplayIcon/>
        <ResetText>Reset</ResetText>
      </ResetContainer>
    )
  }
}

export default Reset;