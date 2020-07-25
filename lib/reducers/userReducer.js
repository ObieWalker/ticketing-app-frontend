import { HYDRATE} from 'next-redux-wrapper';
import {
  SET_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants";

const initialUserState = {
  user: {},
  loading: false,
  authenticated: false,
}

export const user = (state = initialUserState, action) => {
  console.log("came into user reducer")
  switch (action.type) {
    case SET_USER_SUCCESS:
      console.log("setting user", action.data.user)
      return { ...state, loading: false, user: action.data.user, authenticated: true };
    case SIGN_OUT_SUCCESS:
      return initialUserState;
    default:
      return { ...state };
  }
};