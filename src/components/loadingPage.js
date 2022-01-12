import React from 'react';
import styled, { keyframes } from 'styled-components';
import "../styles/loading.css";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

const UpdateText = styled.h1`
  margin-bottom: 100px;
  text-align: center;
  font-size: 35px;
  font-weight: 700;
`;

const Loader = styled.div`
  margin: 30px auto;
  width: 100%;
  animation: 1s ${fadeIn} ease-out;
`;

export default function LoadingPage(props) {
  return (
    <div>
      <UpdateText>{props.status2}</UpdateText>
      <Loader>
        <div className="la-line-scale-pulse-out la-dark la-2x">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Loader>
    </div>
  )
}