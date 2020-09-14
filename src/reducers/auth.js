import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
} from "../actions/types";

const initialState = {
  token: null,
  error: null,
  loading: false,
  authentication: null,
};

const authStart = (state, action) => {
  return {
    ...state,
    token: null,
    error: null,
    loading: true,
    authentication: false,
  };
};

const authSuccess = (state, action) => {
  return {
    ...state,
    token: action.token,
    error: null,
    loading: false,
    authentication: true,
  };
};

const authFail = (state, action) => {
  return {
    ...state,
    token: null,
    error: action.error,
    loading: false,
    authentication: false,
  };
};

const authLogout = (state, action) => {
  return { ...state, token: null, authentication: false };
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return authStart(state, action);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default authReducer;
