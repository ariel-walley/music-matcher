import { SET_MAIN_USER, SET_USERS } from './actionTypes';

export const setMainUser = (content) => ({
  type: SET_MAIN_USER,
  payload: content
});

export const setUsers = (content) => ({
  type: SET_USERS,
  payload: content
});