import {
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  GET_COMMENTS,
} from "../constants/stateConstants";

const initialUserState = {
  comments : []
}

export const comment = (state = initialUserState, action) => {
  switch (action.type) {
    case GET_COMMENTS:
      return { ...state, comments: action.data };
    case CREATE_COMMENT_SUCCESS:
      return {...state, comments: state.comments.concat(action.data)}
    case CREATE_COMMENT_FAILURE:
      return { ...state, comments: state.comments.filter(val => val.id)}
    default:
      return { ...state };
  }
};