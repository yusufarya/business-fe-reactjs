// actions/sidebarActions.js

export const SET_SIDEBAR_SHOW = 'SET_SIDEBAR_SHOW';

export const setSidebarShow = (isVisible) => ({
  type: SET_SIDEBAR_SHOW,
  payload: isVisible,
});
