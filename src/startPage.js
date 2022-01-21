import React, { useState } from 'react';
import Popup from './components/popup';
import styled, { keyframes } from 'styled-components';

const UserInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  transition: color 5s;
`;

const TutorialText = styled.button`
  margin: -2px auto 7px auto;
  padding: 3px;
  width: 550px;
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 15px; 
  transition: color 5s;
`;

const InputDiv = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const InputLabel = styled.label`
  margin: 10px;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
`;

const Input = styled.input`
  margin: 20px;
  border: 0;
  height: 35px;
  width: 250px;
  border-radius: 5px;
  font-family: "Roboto", Arial, sans-serif;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

const InputLabelsFade = styled(InputLabel)`
  transition: color 5s;
  animation: 0.4s ${fadeIn} ease-out;
`;

const InputFade = styled(Input)`
  animation: 0.4s ${fadeIn} ease-out;
`;

const Error = styled.p`
  margin: 0 auto;
  max-width: 350px;
  background-color: red;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-family: "Roboto", Arial, sans-serif;
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
  const [errors, toggleErrors] = useState({
    NotMinUsers: false,
    NoMainUser: false,
    InvalidID: false,
    InvalidIDInfo: '',
    NoPublicPlaylists: false,
    NoPublicInfo: ''
  })
  const [userInputs, updateUserInputs] = useState({ // These are just the inputs; usernames (below) are the cleaned-up usernames
    mainUsername: ''
  })
  const [mainUsername, setMainUsername] = useState('');
  const [usernames, setUsernames] = useState({});

  const displayPopup = () => {
    if (showPopup) {
      return <Popup closePopup={togglePopup}/>
    }
  }

  const handleChangeMainUsername = (input) => { // Set state with main username input and decide whether to display other users' inputs
    toggleOtherUsers((input.length > 2 || userDisplay) ? true : false);
    updateUserInputs({...userInputs, mainUsername: input});
  } 

  const handleChangeOtherUsername = (event) => { // Set state with username input for other users
    let id = event.target.id;
    let value = event.target.value;
    updateUserInputs({...userInputs, [id]: value})
  }

  const handleEnter = (event) => {  // Submit user input if 'Enter' key is pressed   
    if (event.key !== undefined) {
      if (event.key === 'Enter') {submitInputs()}
    } else if (event.keyCode !== undefined) {
      if (event.keyCode === 13) {submitInputs()};
    }
  }

  const displayOtherUsers = () => { // Display block for other users' inputs
    if (userDisplay) {
      return (
        <UserInputContainer>       
          <InputLabelsFade>Enter up to three other Spotify usernames to compare your music picks:</InputLabelsFade>
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

  const displayError = () => { // Display error is username is invalid
    if (errors.NoMainUser) {
      return <Error>Please make sure to list your username or a main username.</Error>
    } else if (errors.NotMinUsers) {
      return <Error>Please enter at least two usernames.</Error>
    } else if (errors.InvalidID) {
      return <Error>{errors.InvalidIDInfo} is not a valid username. Please try again.</Error>
    } else if (errors.NoPublicPlaylists) {
      return <Error>Uh oh! One of the users (username: {errors.ErrorNoPublicInfo}) doesn't have any public playlists so we can't compare your playlists. Please remove their username and try again.</Error>
    }
  }

  const verifyUsernames = async () => { // Request display names from API and verify username input  

    // Trim white space in input fields and eliminate null or empty options
    let trimmedUsers = Object.values(userInputs).map((user) => { 
      let trimmedUser = user.trim();
      if (trimmedUser && trimmedUser !== "") {
        if (trimmedUser.search("spotify:user:") > -1 ) {
          trimmedUser = trimmedUser.slice(13);
        }
        if (user === userInputs.mainUsername) { setMainUsername(trimmedUser)};
        return trimmedUser;
      }
    }).filter(Boolean); // Remove undefined values (i.e., empty inputs that were not returned to .map)

    // Check there are two users at minimum
    if (trimmedUsers.length < 2) { 
      toggleErrors({...errors, NotMinUsers: true})   
      return
    }
    
    // Check if a main user is listed
    if (userInputs.mainUsername === "" || userInputs.mainUsername === null) { 
      toggleErrors({...errors, NoMainUser: true})
      return
    }

    // Fetch request for display names/user verification
    let newUsernames = {};

    for (let user of trimmedUsers) { 
      const mainUserCheck = (user === 'mainUsername');

      let url = `https://api.spotify.com/v1/users/${user}`
      let response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
      });
      let data = await response.json();

      // Check that users are valid
      if (Object.keys(data)[0] === "error" && data.error.status === 404) { 
        toggleErrors({...errors, InvalidID: true, InvalidIDInfo: user})   
        return
      } 
      
      // Handle rate limiting
      while (Object.keys(data)[0] === "error" && data.error.status === 429) { 
        data = await this.fetchRetry(response, url);
      }

      // Update state
      newUsernames[user] = data.display_name;
    }
    setUsernames(newUsernames);
  }

  const submitInputs = () => {
    console.log('SUBMITTED!');

    // Resetting any info from previous submits
    setMainUsername('');
    setUsernames({});
    toggleErrors({ 
      NotMinUsers: false,
      NoMainUser: false,
      InvalidID: false,
      InvalidIDInfo: '',
      NoPublicPlaylists: false,
      NoPublicInfo: ''
    });
    
    verifyUsernames();
//  submitUsernames();
  }

  return (
    <UserInputContainer> 
      <InputLabel htmlFor="your_username" >Enter your Spotify username here:</InputLabel>
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