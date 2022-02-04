import React, { useState } from 'react';
import Popup from './components/popup';
import styled from 'styled-components';
import { fadeIn, Heading3 } from './styles/styles';

const UserInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  transition: color 5s;
`;

const TutorialText = styled.div`
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

const InputDiv = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  margin: 20px;
  border: 0;
  height: 35px;
  width: 250px;
  border-radius: 5px;
  font-family: "Roboto", Arial, sans-serif;
`;

const Heading3sFade = styled(Heading3)`
  transition: color 5s;
  animation: 0.4s ${fadeIn} ease-out;
`;

const InputFade = styled(Input)`
  animation: 0.4s ${fadeIn} ease-out;
`;

const Error = styled.div`
  margin: 0 auto;
  max-width: 350px;
  background-color: red;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 16px;
`;

const SubmitButton = styled.button`
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
        <UserInputContainer>       
          <Heading3sFade>Enter up to three other Spotify usernames to compare your music picks:</Heading3sFade>
          <InputDiv>
            <InputFade type="text" id="username0" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
            <InputFade type="text" id="username1" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
            <InputFade type="text" id="username2" onChange={handleChangeOtherUsername} onKeyDown={handleEnter}/>
          </InputDiv>
          <SubmitButton type="submit" onClick={submitInputs}>Submit</SubmitButton>
        </UserInputContainer>
      )  
    }
  }

  const displayError = () => {
    if (props.errorsState.errors.NoMainUser) {
      return <Error>Please make sure to list your username or a main username.</Error>
    } else if (props.errorsState.errors.NotMinUsers) {
      return <Error>Please enter at least two usernames.</Error>
    } else if (props.errorsState.errors.InvalidID) {
      return <Error>{props.errorsState.errors.InvalidIDInfo} is not a valid username. Please try again.</Error>
    } else if (props.errorsState.errors.NoPublicPlaylists) {
      return <Error>Uh oh! One of the users ({props.errorsState.errors.NoPublicInfo}) doesn't have any public playlists so we can't compare your playlists. Please remove their username and try again.</Error>
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
    <UserInputContainer> 
      <Heading3 htmlFor="your_username" >Enter your Spotify username here:</Heading3>
      <TutorialText onClick={() => {togglePopup(!showPopup)}}>Not sure how to find a Spotify username? <span>Click here for help!</span></TutorialText>
      <InputDiv>
        <Input
          type="text"
          id="your_username"
          onChange={e => handleChangeMainUsername(e.target.value)}
        />
      </InputDiv>
      {displayOtherUsers()}
      {displayError()}
      {displayPopup()} 
    </UserInputContainer>
  )
}