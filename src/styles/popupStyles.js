import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Container } from '../styles/styles';

export const MainPageDarken = styled.div`
  width: 100%;  
  height: 100%; 
  margin: auto;  
  position: fixed;  
  top: 0;  
  left: 0;  
  right: 0;  
  bottom: 0;  
  background-color: rgba(0,0,0, 0.5);  
`;

export const PopupContainer = styled.div`
  margin: 0 auto; 
  padding: 10px;
  position: absolute;  
  left: 15%;  
  right: 15%;  
  top: 15%;  
  bottom: 15%;   
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 20px;  
  background: white;  
  color: black;
`;

export const PopupBodyContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
`;

export const StyledBackIcon = styled(ArrowBackIcon)`
  color: #5B5B5B;
  width: 27px;
  cursor: pointer;
  position: absolute;
  top: 13px;
  left: 13px;
`;

export const StyledCloseIcon = styled(CloseIcon)`
  color: #5B5B5B;
  width: 27px;
  cursor: pointer;
  position: absolute;
  top: 13px;
  right: 13px;
`;

export const OptionContainer = styled(Container)`
  flex-direction: row;
`;

export const OptionContainer2 = styled(Container)`
  flex-basis: 33.333%;
`;

export const ListContainer = styled.ol`
  text-align: left;
  padding: 0 20px;
`;

export const List = styled.li`
  margin: 25px 0;
  font-size: 16px;
`;

export const Text = styled.p`
  text-align: center;
`;

