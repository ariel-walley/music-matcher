const initialState = {
  mainUsername: '',
  usernames: {}
};

function reducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_MAIN_USER':
      return { ...state, mainUsername: action.payload };
    case 'SET_USERS':
      return { ...state, usernames: action.payload };
    default: return state;
  }
};

export default reducer;