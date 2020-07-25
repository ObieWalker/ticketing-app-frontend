import React, { Component } from 'react'
import Router from "next/router";
import nextCookie from "next-cookies";

export const auth = ctx => {
  const { token } = nextCookie(ctx);

  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: "/auth/login" });
    ctx.res.end();
    return;
  }

  if (!token) {
    Router.push("/auth/login");
  }

  return token;
};

export const withAuthSync = WrappedComponent =>
  class extends Component {

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };