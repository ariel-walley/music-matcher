import React from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import styled from 'styled-components';
import { Heading2 } from '../styles/styles';

const ResetContainer = styled.div`
  margin: ${props => props.margin};
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

export default function Reset(props) {
  return(
    <ResetContainer onClick={props.function}>
      <ReplayIcon/>
      <Heading2>Reset</Heading2>
    </ResetContainer>
  )
}