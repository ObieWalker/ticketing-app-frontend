import React from 'react';
import Head from 'next/head';
import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import Router from 'next/router'
import Loader from 'react-loader-spinner'
import { userRoleName } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil'
import { withAuthSync } from '../../utils/auth'
import MakeRequest from '../../components/request/MakeRequest'
import ViewRequests from '../../components/request/ViewRequests'
import Users from '../../components/users/Users'
import { titleize } from '../../utils/formatUtil'
import { setUser } from '../../lib/actions/userActions'
import DashboardLayout from '../../components/layout/DashboardLayout'
import utilStyles from '../../styles/utils.module.css'

const Dashboard = () => {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)

  useEffect(() => {
    const token = getCookie("token")
    if (!token) redirectOnError()
    getUser(token)
   }, [])

  const getUser = async (token) => {

    const apiUrl = `${process.env.API_SERVER}api/users`
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
            <h2>{role && `${userRoleName(role)} Dashboard.`}</h2>
            {(() => {
              switch (role) {
                case "0": return (
                  <>
                    <Users />
                    <hr />
                    <ViewRequests />
                  </>
                );
                case "1": return (
                  <>
                    <ViewRequests />
                  </>
                );;
                case "2": return (
                  <>
                    <MakeRequest />
                    <hr />
                    <ViewRequests />
                  </>
                );
                default: return (
                  <span className={utilStyles.tableLoader}>
                  <Loader
                    type="Grid"
                    color="#4699B3"
                    height={200}
                    width={300}
                  />
                </span>
                );
              }
            })()}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default connect((state) => state)(withAuthSync(Dashboard))