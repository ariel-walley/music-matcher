import React from 'react';
import styled from 'styled-components';

const MainHeader = styled.h1`
  width: 100%;
  margin: 0 auto;
  padding: 5px;
  position: fixed;
  background-color: black;
  color: white;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 35px;
  font-weight: 700;
  text-align: center;
`;

export default function MainHeader() {
  return <MainHeader onClick={this.props.function}>Music Matcher</MainHeader>
}