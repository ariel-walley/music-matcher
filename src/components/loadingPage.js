import React from 'react';
import styled from 'styled-components';
import { fadeIn, Heading1 } from '../styles/styles';
import "../styles/loading.css";

const Loader = styled.div`
  margin: 100px;
  animation: 1s ${fadeIn} ease-out;
`;

export default function LoadingPage(props) {
  return (
    <div>
      <Heading1>{props.status2}</Heading1>
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