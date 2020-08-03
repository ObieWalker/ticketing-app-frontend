import { HYDRATE} from 'next-redux-wrapper';
import {
  SET_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants/stateConstants";

const initialUserState = {
  user: {},
  loading: false,
  authenticated: false,
}

export const user = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER_SUCCESS:
      return { ...state, loading: false, user: action.data.user, authenticated: true };
    case SIGN_OUT_SUCCESS:
      return initialUserState;
    default:
      return { ...state };
  }
};