export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';

export const setIsLoggedIn = (status) => ({
  type: SET_IS_LOGGED_IN,
  payload: status,
});
