import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

export const Heading1 = styled.h1`
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 25px;
`;

export const Heading2 = styled.h2`
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 8px 25px;
  padding: 0;
`;

export const Heading3 = styled.h3`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 0 25px;
  padding: 0;
`;