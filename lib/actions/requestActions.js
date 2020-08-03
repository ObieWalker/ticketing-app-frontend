import {
  CREATE_REQUEST_SUCCESS,
  CREATE_REQUEST_FAILURE,
  GET_REQUESTS,
  UPDATE_REQUEST_STATUS,
  SET_REQUEST_TO_CHANGE
} from "../constants/stateConstants";

export const createRequestSuccess = (data) => dispatch => {
  dispatch({
    type: CREATE_REQUEST_SUCCESS,
    data
  })
};

export const createRequestFailure = () => dispatch => {
  dispatch({
    type: CREATE_REQUEST_FAILURE
  })
};

export const getRequestsSuccess = (data) => dispatch => {
  dispatch({
    type: GET_REQUESTS,
    data
  })
};

export const setRequestToChange = (request) => dispatch => {
  dispatch({
    type: SET_REQUEST_TO_CHANGE,
    request
  })
}

export const updateRequestStatus = (requestId) => dispatch => {
  dispatch({
    type: UPDATE_REQUEST_STATUS,
    requestId
  })
}