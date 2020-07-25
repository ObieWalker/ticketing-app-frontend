import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'
import cookie from 'js-cookie';
import { useFormik } from 'formik';
import * as yup from "yup"
import { setUser } from '../../lib/actions/userActions'
import LoginForm from '../../components/auth/loginForm'
import httpClient from '../../helpers/httpClient'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { useState } from 'react';

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

  const [loginError, setLoginError] = useState(null)
  const handleLogin = async (user) => {
    const resp = await fetch('http://localhost:3000/api/login', {
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
      setUser(json)
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