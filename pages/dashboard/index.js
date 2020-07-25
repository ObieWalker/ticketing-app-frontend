import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import nextCookie from "next-cookies";
import useSWR from 'swr'
import { connect } from 'react-redux'
import Router from 'next/router'
import Error from 'next/error';
import {getToken} from '../../helpers/customMethods'
import { getCookie } from '../../utils/cookieUtil'
import { withAuthSync } from '../../utils/auth'

const Dashboard = (props) => {

  const { username, email, role } = props.user

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section>
          <div>
            <h2> Hi {username}</h2>

          </div>
          Bio
          Email
          <p> {email} </p>
        </section>
      </div>
      <div>
        <h3>My posts</h3>
      </div>
    </>
  );
}

Dashboard.getInitialProps = async (ctx) => {
  // const state = reduxStore.getState()
  // console.log("state>>>", ctx.store.getState())
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