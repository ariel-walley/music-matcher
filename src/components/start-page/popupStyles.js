import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Container } from '../../styles/styles';

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

export const PopupContainer = styled(Container)`
  margin: 0 auto;
  padding: 10px;
  position: absolute;
  left: 15%;
  right: 15%;
  top: 15%;
  bottom: 15%;
  flex-direction: column;
  border-radius: 20px;  
  background: white;  
  color: black;
`;

export const PopupBodyContainer = styled(Container)`
  margin: 0 auto;
  justify-content: space-around;
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

export const Img = styled.img`
  width: 409px;
  height: 318px;
  padding: 0 20px;
`;