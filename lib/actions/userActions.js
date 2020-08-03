import {
  SET_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants/stateConstants";

export const setUser = (data) => dispatch => {
  dispatch({
    type: SET_USER_SUCCESS,
    data
  })
};

export const signOutUser = () => dispatch => {
  dispatch({
    type: SIGN_OUT_SUCCESS
  })
};