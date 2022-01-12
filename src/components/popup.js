import React from 'react';  
import styled from 'styled-components';
import { CloseCircle } from '@styled-icons/ionicons-outline/CloseCircle';

const MainPageDarken = styled.div`
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

const PopupContainer = styled.div`
  margin: 0 auto; 
  padding: 10px;
  position: absolute;  
  left: 15%;  
  right: 15%;  
  top: 15%;  
  bottom: 15%;   
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 20px;  
  background: white;  
  color: black;
`;

const PopupBodyContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
`;

const Heading = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const Img = styled.img`
  width: 409px;
  height: 318px;
  padding: 0 20px;
`;

const CloseIcon = styled(CloseCircle)`
  color: #979797;
  width: 27px;
  cursor: pointer;
  position: absolute;
  right: 13px;
  top: 13px;
`;

const ListContainer = styled.ol`
  text-align: left;
  padding: 0 20px;
`;

const List = styled.li`
  margin: 25px 0;
  font-size: 16px;
`;

export default function Popup(props) {
  return (  
    <MainPageDarken>
      <PopupContainer>
        <CloseIcon onClick={props.closePopup}/>
        <Heading>How to find a Spotify username:</Heading>
        <PopupBodyContainer>                
          <Img src="/howto.gif" />        
          <ListContainer>
              <List>To find your username, click on your display name in the upper left-hand corner of Spotify. To find a friend's username, search for their name in the search bar in the upper-left hand corner.</List>
              <List>Next to the user's profile picture, click the small circle with three dots on it.</List>
              <List>Hover over the "Share" option.</List>
              <List>Click "Copy Spotify URI."</List>
              <List>Paste into the username input field.</List>
          </ListContainer>
        </PopupBodyContainer>
      </PopupContainer>  
    </MainPageDarken>
  );  
}