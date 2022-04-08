import styled from 'styled-components';
import { fadeIn, Container, Heading2, Heading3 } from '../../styles/styles'

export const MainContainer = styled.div`
  animation: 1s ${fadeIn} ease-out;
`;

export const Card = styled(Container)`
  width: 30%;
  padding: 15px;
  margin: 15px 40px;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

export const CardSongTitle = styled(Heading2)`
  text-align: left;
  margin-block-start: auto;
  margin-block-end: auto;
`;

export const CardArtist = styled(Heading3)`
  text-align: left;
`;

export const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;