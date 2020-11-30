import { setMainUser, setUsers } from './actions';

const INITIAL_STATE = {
  mainUsername: '', //SET_MAIN_USER
  usernames: {}, //SET_USERS
  duplicatesFound: 'start', //SET_STATUS
  duplicateSongs: [], //SET_SONGS
  duplicatesLength: 0, //SET_SONGS_LENGTH
  duplicateArtists: [], //SET_ARTISTS
  topArtists: [] //SET_TOP_ARTISTS
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_MAIN_USER':
      return {
        ...state, 
        mainUsername: action.payload
      };
    case 'SET_USERS':
      return {
        ...state, 
        usernames: action.payload
      };
    default: {
      return state
    };
  }
};

export default reducer;