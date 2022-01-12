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
  font-size: 24px; 
  font-weight: 600;
`;

export default function Reset(props) {
  return(
    <ResetContainer onClick={props.function}>
      <ReplayIcon/>
      <ResetText>Reset</ResetText>
    </ResetContainer>
  )
}