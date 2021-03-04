import { SET_MAIN_USER, SET_USERS, SET_STATUS, SET_SONGS, SET_ARTISTS, SET_TOP_ARTISTS} from './actionTypes';

export const setMainUser = (content) => ({
  type: SET_MAIN_USER,
  payload: content
});

export const setUsers = (content) => ({
  type: SET_USERS,
  payload: content
});

export const setStatus = (content) => ({
  type: SET_STATUS,
  payload: content
});

export const setSongs = (content) => ({
  type: SET_SONGS,
  payload: content
});

export const setArtists = (content) => ({
  type: SET_ARTISTS,
  payload: content
});

export const setTopArtists = (content) => ({
  type: SET_TOP_ARTISTS,
  payload: content
});