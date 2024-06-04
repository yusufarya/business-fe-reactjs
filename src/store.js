import { legacy_createStore as createStore, combineReducers } from 'redux';

// Initial state
const initialState = {
  sidebarShow: true,
  theme: 'light',
  dataUser: null,
  isLoggedIn: null,
};

// Action types
const SET_SIDEBAR_SHOW = 'SET_SIDEBAR_SHOW';
const SET_THEME = 'SET_THEME';
const SET_USER_DATA = 'SET_USER_DATA';
const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';

// Reducers
const sidebarShowReducer = (state = initialState.sidebarShow, action) => {
  switch (action.type) {
    case SET_SIDEBAR_SHOW:
      return action.payload;
    default:
      return state;
  }
};

const themeReducer = (state = initialState.theme, action) => {
  switch (action.type) {
    case SET_THEME:
      return action.payload;
    default:
      return state;
  }
};

const userReducer = (state = initialState.dataUser, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};

const loginReducer = (state = initialState.isLoggedIn, action) => {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  sidebarShow: sidebarShowReducer,
  theme: themeReducer,
  dataUser: userReducer,
  isLoggedIn: loginReducer,
});

// Create store
const store = createStore(rootReducer);
export default store;
