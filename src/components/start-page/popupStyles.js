import styled from 'styled-components';
import { CloseCircle } from '@styled-icons/ionicons-outline/CloseCircle';

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

export const Img = styled.img`
  width: 409px;
  height: 318px;
  padding: 0 20px;
`;

export const CloseIcon = styled(CloseCircle)`
  color: #979797;
  width: 27px;
  cursor: pointer;
  position: absolute;
  right: 13px;
  top: 13px;
`;

export const ListContainer = styled.ol`
  text-align: left;
  padding: 0 20px;
`;

export const List = styled.li`
  margin: 25px 0;
  font-size: 16px;
`;

