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
        mainUsername: 'updated'
      };
    case 'SET_USERS':
      return {
        ...state, 
        usernames: {'user1': 123, 'user2': 1324}
      };
    default: {
      return state
    };
  }
};

export default reducer;