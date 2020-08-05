import Head from 'next/head'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import cookie from 'js-cookie';
import {toast} from 'react-toastify';
import {getCookie} from '../../utils/cookieUtil';
import {signOutUser} from '../../lib/actions/userActions'
import styles from './layout.module.css'
import utilStyles from '../../styles/utils.module.css'

export default function DashboardLayout({ children, home }) {
  const dispatch =  useDispatch();

  const logout = async () => {
    const token = getCookie("token")

    dispatch(signOutUser())
    cookie.remove('token')
    Router.push('/')
    const resp = await fetch(`${process.env.API_SERVER}api/sessions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token
      }
    })
    const json = await resp.json()

    if (json.status != 200) {
      toast.error(json.message)
    }
  }

  return (
    <div className={styles.dashboardContainer}>
     
      <header className={styles.layoutHeader}>
      <a className={styles.logoutButton} onClick={logout}>Logout</a>

      </header>
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}