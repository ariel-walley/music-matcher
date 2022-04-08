import styled from 'styled-components';
import { fadeIn, Container } from '../../styles/styles';

export const MainContainer = styled.div`
  width: 100%;
  animation: 1s ${fadeIn} ease-out;
`;

export const Card = styled(Container)`
  width: 25%;
  padding: 15px;
  margin: 15px;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

export const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10 18px 10 10;
`;