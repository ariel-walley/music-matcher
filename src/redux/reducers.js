const initialState = {
  mainUsername: '',
  usernames: {},
  status: 'start',
  duplicateSongs: [],
  duplicateArtists: [],
  topArtists: []
};

function reducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_MAIN_USER':
      return { ...state, mainUsername: action.payload };
    case 'SET_USERS':
      return { ...state, usernames: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_SONGS':
      return { ...state, duplicateSongs: action.payload };
    case 'SET_ARTISTS':
      return { ...state, duplicateArtists: action.payload };
    case 'SET_TOP_ARTISTS':
      return { ...state, topArtists: action.payload };
    default: return state;
  }
};

export default reducer;