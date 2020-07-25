import {
  SET_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants";

export const setUser = (data) => {
  console.log("data in action")
  return {
    type: SET_USER_SUCCESS,
    data
  }
};

export const signOutUser = () => {
  return {
    type: SIGN_OUT_SUCCESS
  }
};