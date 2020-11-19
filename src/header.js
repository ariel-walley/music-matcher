import React from 'react';
import styled from 'styled-components';

const HeaderBlock = styled.h1`
  width: 100%;
  margin: 0 auto;
  padding: 5px;
  position: fixed;
  background-color: black;
  color: white;
  font-size: 35px;
  text-align: center;
`;

class Header extends React.Component {
  render() {
    return(
      <HeaderBlock>Music Matcher</HeaderBlock>
    )
  }
}

export default Header;