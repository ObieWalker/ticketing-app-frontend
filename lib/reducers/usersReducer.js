import { HYDRATE} from 'next-redux-wrapper';
import {
  USER_MODIFIED,
  GET_USERS_SUCCESS
} from "../constants/stateConstants";

const initialUsersState = {
  allUsers: []

}

export const users = (state = initialUsersState, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return { ...state, allUsers: action.users };
    case USER_MODIFIED:
      let newChangeState = { ...state };
      newChangeState.allUsers.map(val => {
        if (val.id ==  action.user){
          val.changed = true
        } else {
          val.changed = false
        }
      })
      return newChangeState
    default:
      return { ...state };
  }
};