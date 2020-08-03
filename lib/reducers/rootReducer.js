import { combineReducers } from "redux";
import { user } from "./userReducer";
import { request } from './requestReducer'
import { comment } from './commentReducer'
import { users } from './usersReducer'

export default combineReducers({
  user,
  request,
  comment,
  users
});
