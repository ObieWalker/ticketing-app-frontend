import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import nextCookie from "next-cookies";
import useSWR from 'swr'
import { connect } from 'react-redux'
import Router from 'next/router'
import Error from 'next/error';
import { userRoleName } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil'
import { withAuthSync } from '../../utils/auth'
import MakeRequest from '../../components/request/MakeRequest'
import ViewRequests from '../../components/request/ViewRequests'
import { titleize } from '../../utils/formatUtil'


const Dashboard = (props) => {

  const { username, role } = props.user.user

  return (
    <>
      <Head>
      <link rel="icon" href="/favicon.ico" />
        <title>{titleize(username)}'s Dashboard</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section style={{ width: '100%' }}>
          <div>
            <h2>{userRoleName(role)} Page.</h2>
            <MakeRequest />
            <hr />
            <ViewRequests />
          </div>
        </section>
      </div>
    </>
  );
}

Dashboard.getInitialProps = async (ctx) => {
  const { user } =  ctx.store.getState()
  if (user.authenticated) return user
  const {token} = nextCookie(ctx)
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const apiUrl = process.browser
    ? `${protocol}://${window.location.host}/api/getUser`
    : `${protocol}://${ctx.req.headers.host}/api/getUser`;


  const redirectOnError = () => {
    process.browser
      ? Router.push("/auth/login")
      : ctx.res.writeHead(301, { Location: "/auth/login" });
  }

  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        token: token
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      return redirectOnError();
    }
  } catch (error) {
    return redirectOnError();
  }
}

export default connect((state) => state)(withAuthSync(Dashboard))