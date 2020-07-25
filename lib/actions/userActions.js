import {
  SIGNING_IN_SUCCESS,
  CURRENT_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants";

export const signInUser = (data) => {
  return {
    type: SIGNING_IN_SUCCESS,
    data
  }
};

export const currentUser = (data) => {
  return {
    type: CURRENT_USER_SUCCESS,
    data
  }
};

export const signOutUser = () => {
  return {
    type: SIGN_OUT_SUCCESS
  }
};