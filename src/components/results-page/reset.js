import React from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import styled from 'styled-components';
import { Container, Heading2 } from '../../styles/styles';

const ResetContainer = styled(Container)`
  margin: ${props => props.margin};
`;

export default function Reset(props) {
  return(
    <ResetContainer onClick={props.function}>
      <ReplayIcon/>
      <Heading2>Reset</Heading2>
    </ResetContainer>
  )
}