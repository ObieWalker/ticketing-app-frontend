import { createStore, applyMiddleware } from 'redux';
import { createWrapper, HYDRATE} from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/rootReducer'
// import { user } from "./reducers/userReducer";
import {
    SET_USER_SUCCESS,
    SIGN_OUT_SUCCESS
  } from "../lib/constants";

const configureStore = (initialState = {}) => {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );
};
 

const makeStore = (context, initialState = {}) => createStore(user);;

export const wrapper = createWrapper(makeStore, {debug: true});