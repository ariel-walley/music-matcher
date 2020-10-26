import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Link = styled.a`
  font-size: 20px;
  text-align: center;
  text-decoration: underline;
`;

class Menu extends React.Component {
  render() {
    return(
      <Container>
        <Link href="">See all shared artists</Link>
        <Link href="">Shared states</Link>
        <Link href="">New search</Link>
      </Container>
    )
  }
}

export default Menu;