import React from 'react';  

import * as styles from './popupStyles';
import { Heading3 } from '../../styles/styles';

export default function Popup(props) {
  return (  
    <styles.MainPageDarken>
      <styles.PopupContainer>
        <styles.CloseIcon onClick={() => props.closePopup(false)}/>
        <Heading3>How to find a Spotify username:</Heading3>
        <styles.PopupBodyContainer>                
          <styles.Img src="/howto.gif" />        
          <styles.ListContainer>
              <styles.List>To find your username, click on your display name in the upper left-hand corner of Spotify. To find a friend's username, search for their name in the search bar in the upper-left hand corner.</styles.List>
              <styles.List>Next to the user's profile picture, click the small circle with three dots on it.</styles.List>
              <styles.List>Hover over the "Share" option.</styles.List>
              <styles.List>Click "Copy Spotify URI."</styles.List>
              <styles.List>Paste into the username input field.</styles.List>
          </styles.ListContainer>
        </styles.PopupBodyContainer>
      </styles.PopupContainer>  
    </styles.MainPageDarken>
  );  
}