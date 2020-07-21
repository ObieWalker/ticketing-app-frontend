import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr'
// import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import Error from 'next/error';
import {getToken} from '../helpers/customMethods'
import {getCookieValue} from '../helpers/cookieHelper'
import { getCookie } from '../utils/cookieUtil'
import { useCurrentUser, getUser } from '../../lib/hooks'



export default function Dashboard({user}) {

  return (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section>
          <div>
            <h2> Hi {user.username}</h2>

          </div>
          Bio
          Email
          <p> {user.email} </p>
        </section>
      </div>
      <div>
        <h3>My posts</h3>
      </div>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookie = req?.headers?.cookie
  let token
  if (cookie) token = getCookieValue(cookie, "token")
  const res = await fetch('http://localhost:3000/api/getUser', {
    headers: {
      token
    }
  })
  const json = await res.json()
  return { props: 
    { user: json.user }
  }
}