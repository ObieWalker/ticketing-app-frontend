import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import cookie from 'js-cookie';
import { useFormik } from 'formik';
import * as yup from "yup"
import { setUser } from '../../lib/actions/userActions'
import LoginForm from '../../components/auth/loginForm'
import Layout from '../../components/layout/layout'
import { getCookie } from '../../utils/cookieUtil'
import utilStyles from '../../styles/utils.module.css'

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(5)
    .max(16)
    .required()
})


export default function Login() {

  const dispatch =  useDispatch();

  useEffect(() => {
    const token = getCookie("token")
    if (token) getUser(token)
  }, [])

  const getUser = async (token) => {

    const apiUrl = `${process.env.API_SERVER}api/users`
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
      Router.push('/dashboard')
    }
  }

  const [loginError, setLoginError] = useState(null)
  const handleLogin = async (user) => {
    const resp = await fetch(`${process.env.API_SERVER}api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user
      })
    })
    const json = await resp.json()

    if (json.status == 200) {
      dispatch(setUser(json))
      cookie.set("token", json.user.token, { expires: 600 });
      Router.push('/dashboard')
    } else {
      setLoginError(json.message)
    }
  }

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit(values){ handleLogin(values)}

  })
  return (
    <Layout>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={utilStyles.form}>
        <p className={utilStyles.errorMessage}>
          {loginError && loginError}
        </p>
        <LoginForm
          onSubmit={handleSubmit}
          errors={errors}
          values={values}
          onChange={handleChange}
          />
        <p>To register, click <Link href="/auth/register"><a>Register</a></Link></p>
      </div>
    </Layout>
  )
}