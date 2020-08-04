import React from 'react';
import { Provider } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'
import App from 'next/app';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css';
import store from '../lib/store';
import ErrorBoundary from '../components/ErrorBoundary';

toast.configure()

class MyApp extends App {
  render(){
    const { Component, pageProps } = this.props
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <Component {...pageProps}></Component>
        </Provider>
      </ErrorBoundary>
    )
  }
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore)

export default wrapper.withRedux(MyApp);

