import {
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  GET_COMMENTS,
} from "../constants/stateConstants";

export const createCommentSuccess = (data) => dispatch => {
  dispatch({
    type: CREATE_COMMENT_SUCCESS,
    data
  })
};

export const createCommentFailure = () => dispatch => {
  dispatch({
    type: CREATE_COMMENT_FAILURE
  })
};

export const getCommentsSuccess = (data) => dispatch => {
  dispatch({
    type: GET_COMMENTS,
    data
  })
};
