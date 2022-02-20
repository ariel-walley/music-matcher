import styled from 'styled-components';
import { fadeIn, Container, Heading3 } from './styles';

export const UserInputContainer = styled(Container)`
  flex-direction: column;
  flex-wrap: wrap;
  transition: color 5s;
`;

export const TutorialText = styled.div`
  margin-top: 15px;
  padding: 3px;
  width: 550px;
  font-family: "Roboto", Arial, sans-serif;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  cursor: pointer;
  transition: color 5s;
  font-size: 16px;
  text-align: center;
`;

export const InputDiv = styled(Container)`
  margin: 0 auto;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  margin: 20px;
  border: 0;
  height: 35px;
  width: 250px;
  border-radius: 5px;
  font-family: "Roboto", Arial, sans-serif;
`;

export const Heading3sFade = styled(Heading3)`
  transition: color 5s;
  animation: 0.4s ${fadeIn} ease-out;
`;

export const InputFade = styled(Input)`
  animation: 0.4s ${fadeIn} ease-out;
`;

export const Error = styled.div`
  margin: 0 auto;
  max-width: 350px;
  background-color: red;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  margin: 10px auto;
  width: 70px;
  padding: 7px;
  border: 0;
  border-radius: 5px;
  background-color: white;
  text-align: center;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 16px;
  animation: 0.4s ${fadeIn} ease-out;
`;