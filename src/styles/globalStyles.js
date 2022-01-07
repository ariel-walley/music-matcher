import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    width: 100%;
  }

  #root {
    height: 100%;
  }

  body {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 0;
    font-family: "Open Sans", Arial, sans-serif;

  }

  span {
    text-decoration: underline;
  }
`;

export default GlobalStyle;