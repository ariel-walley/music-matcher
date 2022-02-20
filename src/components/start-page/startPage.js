import React, { useState } from 'react';
import Popup from './popup';

import * as styles from '../../styles/startPageStyles';
import { Heading3 } from '../../styles/styles';

export default function StartPage(props) {
  const [showPopup, togglePopup] = useState(false);
  const [userDisplay, toggleOtherUsers] = useState(false);
  const [userInputs, updateUserInputs] = useState({
    mainUsername: ''
  })

  const displayPopup = () => {
    if (showPopup) {
      return <Popup closePopup={togglePopup}/>
    }
  }

  // Set state with main username input and decide whether to display other users' inputs
  const handleChangeMainUsername = (input) => { 
    toggleOtherUsers((input.length > 2 || userDisplay) ? true : false);
    updateUserInputs({...userInputs, mainUsername: input});
  } 

  // Set state with username input for other users
  const handleChangeOtherUsername = (event) => { 
    let id = event.target.id;
    let value = event.target.value;
    updateUserInputs({...userInputs, [id]: value})
  }

  const handleEnter = (event) => { 
    if (event.key !== undefined) {
      if (event.key === 'Enter') {submitInputs()}
    } else if (event.keyCode !== undefined) {
      if (event.keyCode === 13) {submitInputs()};
    }
  }

  // Conditional rendering of the display block with other users' inputs
  const displayOtherUsers = () => { 
    if (userDisplay) {
      return (
        <styles.UserInputContainer>       
          <styles.Heading3sFade>Enter up to three other Spotify usernames to compare your music picks:</styles.Heading3sFade>
          <styles.InputDiv>
            <styles.InputFade type="text" id="username0" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
            <styles.InputFade type="text" id="username1" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
            <styles.InputFade type="text" id="username2" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
          </styles.InputDiv>
          <styles.SubmitButton type="submit" onClick={submitInputs}>Submit</styles.SubmitButton>
        </styles.UserInputContainer>
      )  
    }
  }

  const displayError = () => {
    if (props.errorsState.errors.NoMainUser) {
      return <styles.Error>Please make sure to list your username or a main username.</styles.Error>
    } else if (props.errorsState.errors.NotMinUsers) {
      return <styles.Error>Please enter at least two usernames.</styles.Error>
    } else if (props.errorsState.errors.InvalidID) {
      return <styles.Error>{props.errorsState.errors.InvalidIDInfo} is not a valid username. Please try again.</styles.Error>
    } else if (props.errorsState.errors.NoPublicPlaylists) {
      return <styles.Error>Uh oh! One of the users ({props.errorsState.errors.NoPublicInfo}) doesn't have any public playlists so we can't compare your playlists. Please remove their username and try again.</styles.Error>
    }
  }

  const verifyUsernames = async (trimmedUsers) => {
    let newUsernames = {};

    for (let user of trimmedUsers) { 
      let url = `https://api.spotify.com/v1/users/${user}`
      let response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
      });
      let data = await response.json();

      // Check that users are valid
      if (Object.keys(data)[0] === "error" && data.error.status === 404) {
        props.errorsState.toggleErrors({...props.errorsState.errors, InvalidID: true, InvalidIDInfo: user})
        return
      } 
      
      // Handle rate limiting
      while (Object.keys(data)[0] === "error" && data.error.status === 429) {
        data = await props.fetchRetry(response.headers, url);
      }

      // Update state
      newUsernames[user] = data.display_name;
    }
    props.usernamesState.setUsernames(newUsernames);
  }

  const submitInputs = async () => {
    // Resetting any info from previous submits
    props.reset(); 

    // Trim white space in input fields and eliminate null or empty options
    let trimmedUsers = Object.values(userInputs).map((user) => { 
      let trimmedUser = user.trim();
      if (trimmedUser && trimmedUser !== "") {
        if (trimmedUser.search("spotify:user:") > -1 ) {
          trimmedUser = trimmedUser.slice(13);
        }
        if (user === userInputs.mainUsername) { props.mainUsernameState.setMainUsername(trimmedUser) };
        return trimmedUser;
      }
    }).filter(Boolean); // Remove undefined values (i.e., empty inputs that were not returned to .map)

    // Check there are two users at minimum
    if (trimmedUsers.length < 2) { 
      props.errorsState.toggleErrors({...props.errorsState.errors, NotMinUsers: true})   
      return
    }
    
    // Check if a main user is listed
    if (userInputs.mainUsername === "" || userInputs.mainUsername === null) { 
      props.errorsState.toggleErrors({...props.errorsState.errors, NoMainUser: true})
      return
    }

    // Fetch request for display names/user verification
    await verifyUsernames(trimmedUsers);

    // Update the app status in home.js
    props.setStatus('fetchPlaylists');
  }

  return (
    <styles.UserInputContainer> 
      <Heading3 htmlFor="your_username" >Enter your Spotify username here:</Heading3>
      <styles.TutorialText onClick={() => {togglePopup(!showPopup)}}>Not sure how to find a Spotify username? <span>Click here for help!</span></styles.TutorialText>
      <styles.InputDiv>
        <styles.Input
          type="text"
          id="your_username"
          onChange={e => handleChangeMainUsername(e.target.value)}
        />
      </styles.InputDiv>
      {displayOtherUsers()}
      {displayError()}
      {displayPopup()} 
    </styles.UserInputContainer>
  )
}