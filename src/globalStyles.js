import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
html {
    height: 100%;
}

body {
    height: 100%;
    margin: 0;
    padding: 0;
    background-image: linear-gradient(to bottom right, rgba(125,0,170,1) 0%, rgba(1,147,167,1) 50%, rgba(0,255,51,1) 100%);
    background-repeat: no-repeat;
  }
`;
 
export default GlobalStyle;