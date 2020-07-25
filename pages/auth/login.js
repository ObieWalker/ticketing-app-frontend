import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'
import cookie from 'js-cookie';
import { useFormik } from 'formik';
import * as yup from "yup"
import { signInUser, currentUser} from '../../lib/actions/userActions'
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
    const values = { user }
    const resp = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values
      })
    })
    const json = await resp.json()

    if (json.status == 200) {
      signInUser(json)
      currentUser(json)
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
        {loginError && loginError}
        <form onSubmit={handleSubmit}>
          <input
            className={utilStyles.formInput}
            type="text"
            onChange={handleChange}
            defaultValue={values.email}
            name="email"
          />
          {errors.email && errors.email}
          <input
            className={utilStyles.formInput}
            type="password"
            onChange={handleChange}
            defaultValue={values.password}
            name="password"
          />
          {errors.password && errors.password}
          <button className={utilStyles.formButton} type="submit">Login</button>
        </form>
        <p>To register, click <Link href="/auth/register"><a>Register</a></Link></p>
      </div>

    </Layout>
  )
}