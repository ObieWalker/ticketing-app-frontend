import React from 'react';
import Head from 'next/head';
import { useEffect } from 'react';
import nextCookie from "next-cookies";
import { connect, useDispatch, useSelector } from 'react-redux'
import Router from 'next/router'
import Error from 'next/error';
import { userRoleName } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil'
import { withAuthSync } from '../../utils/auth'
import MakeRequest from '../../components/request/MakeRequest'
import ViewRequests from '../../components/request/ViewRequests'
import Users from '../../components/users/Users'
import { titleize } from '../../utils/formatUtil'
import { setUser } from '../../lib/actions/userActions'
import DashboardLayout from '../../components/layout/DashboardLayout'


const Dashboard = () => {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)

  useEffect(() => {
    const token = getCookie("token")
    if (!token) redirectOnError()
    getUser(token)
   }, [])

  const getUser = async (token) => {

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const apiUrl = `${protocol}://${window.location.host}/api/getUser`
    try {
      const response = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: token
        }
      });
      const json =  await response.json()
      if (json.status == 200) {
        dispatch(setUser(json))
      } else {
        return redirectOnError();
      }
    } catch (error) {
      return redirectOnError();
    }
  }

  const redirectOnError = () => {
    Router.push("/auth/login")
  }
  const { username, role } = user

  return (
    <DashboardLayout>
      <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>{username && `${titleize(username)}'s`} Dashboard </title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section style={{ width: '100%' }}>
          <div>
            <h2>{userRoleName(role)} Page.</h2>
            <Users />
            <MakeRequest />
            <hr />
            <ViewRequests />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default connect((state) => state)(withAuthSync(Dashboard))