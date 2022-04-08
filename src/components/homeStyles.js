import styled from 'styled-components';
import { Container } from '../styles/styles';

// Styles for gradient background
export const GradientWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(256, 256, 256, 0.02);
  background-attachment: fixed;
`;

export const Gradient = styled.div`
  height: 100%;
  width: 100%;
  background: ${props => props.color};
  background-attachment: fixed;
  transition: opacity 8s;
  opacity: ${props => props.status ? 1 : 0};
  position: fixed;
  z-index: -1;
`;

// Styles for body
export const Body = styled(Container)`
  height: calc(100% - 57px);
  width: 100%;
  padding-top: 57px;
`;

export const Body2 = styled(Body)`
  padding-top: 25px;
  flex-wrap: wrap;
`;