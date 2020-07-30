import {
  CREATE_REQUEST_SUCCESS,
  CREATE_REQUEST_FAILURE,
  GET_REQUESTS,
  SET_REQUEST_TO_CHANGE
} from "../constants";

const initialRequestState = {
  allRequests: []
}

export const request = (state = initialRequestState, action) => {
  switch (action.type) {
    case CREATE_REQUEST_SUCCESS:
      return { ...state, allRequests: action.data.request.concat(state.allRequests) };
    case CREATE_REQUEST_FAILURE:
      const newState = state.allRequests.filter(val => val.id );
      return newState;
    case GET_REQUESTS:
      return { ...state, allRequests: action.data };
    case SET_REQUEST_TO_CHANGE:
      let newChangeState = { ...state };
      newChangeState.allRequests.map(val => {
        if (val.id ==  action.request){
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