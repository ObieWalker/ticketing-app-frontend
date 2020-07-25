import React from 'react';
import App from 'next/app';
import {wrapper} from '../lib/store';

class MyApp extends App {

  static getInitialProps = async ({Component, ctx}) => {

    ctx.store.dispatch({type: 'TOE', payload: 'was set in _app'});

    return {
      pageProps: {
          // Call page-level getInitialProps
          ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
          // Some custom thing for all pages
          pathname: ctx.pathname,
      },
    };
  };

  render() {
    const {Component, pageProps} = this.props;

    return (
        <Component {...pageProps} />
    );
  }
}

export default wrapper.withRedux(MyApp);

// import App, { Container } from 'next/app';
// import React from 'react';
// import { Provider } from 'react-redux';
// import withRedux from 'next-redux-wrapper';
// // import { store } from '../lib/store'
// import {wrapper} from '../lib/store';
// import '../styles/global.css'


// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     return {
//       pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
//     };
//   }

//   render() {
//     const { Component, pageProps, wrapper } = this.props;
//     return (
//       <Container>
//         <Provider store={wrapper}>
//           <Component {...pageProps} />
//         </Provider>
//       </Container>
//     );
//   }
// }

// export default withRedux(store)(MyApp);
// }
// const App = ({Component, pageProps}) => (
//   <Component {...pageProps} />
// );

// export default wrapper.withRedux(App);
