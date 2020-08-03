import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  height: auto;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background: linear-gradient(to bottom right, rgba(125,0,170,1) 0%, rgba(1,147,167,1) 50%, rgba(0,255,51,1) 100%);
  background-attachment: fixed;
}
`;
 
export default GlobalStyle;