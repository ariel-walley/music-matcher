import React from 'react';
import styled from 'styled-components';
import { Heading1 } from '../styles/styles';

const Header = styled(Heading1)`
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  position: fixed;
  background-color: black;
  color: white;
  font-family: "Roboto", Arial, sans-serif;
`;

export default function MainHeader(props) {
  return <Header onClick={props.function}>Music Matcher</Header>
}