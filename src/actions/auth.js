import axios from "axios";
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, AUTH_LOGOUT } from "./types";
import { setAlert } from "./alert";
import { signupUrl, loginUrl } from "../constants";

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = ({ email, password }) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(loginUrl, {
        email: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.access;
        const refresh_token = res.data.refresh;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(setAlert("Authenticated successfully !!", "success"));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(
          setAlert(
            "Error Authenticating !! Try with correct email & password ...",
            "error"
          )
        );
      });
  };
};

export const authSignup = ({ name, email, password, password2 }) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(signupUrl, {
        name: name,
        email: email,
        password: password,
        password2: password2,
      })
      .then((res) => {
        const token = res.data.access;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(6000));
        dispatch(authLogin({ email, password }));
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(setAlert("Error creating an account ... Try again ", "error"));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
