import {
  SIGNING_IN_SUCCESS,
  CURRENT_USER_SUCCESS,
  SIGN_OUT_SUCCESS
} from "../constants";

const initialUserState = {
  user: {},
  loading: false,
  authenticated: false,
}

export const user = (state = initialUserState, action) => {
  switch (action.type) {
    case SIGNING_IN_SUCCESS:
      return { ...state, loading: false, user: action.data.user, authenticated: true };
    case CURRENT_USER_SUCCESS:
      return { ...state, loading: false, user: action.data.user, authenticated: true };
    case SIGN_OUT_SUCCESS:
      return initialUserState;
    default:
      return { ...state };
  }
};