import { combineReducers } from "redux";
import { user } from "./userReducer";
import { request } from './requestReducer'
import { comment } from './commentReducer'

export default combineReducers({
  user,
  request,
  comment
});
