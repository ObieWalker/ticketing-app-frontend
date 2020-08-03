import {
  USER_MODIFIED,
  GET_USERS_SUCCESS
} from "../constants/stateConstants";

export const userModified = (user) => dispatch => {
  dispatch({
    type: USER_MODIFIED,
    user
  })
};

export const getUsersSuccess = (users) => dispatch => {
  dispatch({
    type: GET_USERS_SUCCESS,
    users
  })
}

