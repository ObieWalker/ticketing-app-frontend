import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react';
import Router from 'next/router'
import cookie from 'js-cookie';
import { useFormik } from 'formik';
import * as yup from "yup"
import { useDispatch } from 'react-redux'
import { setUser } from '../../lib/actions/userActions'
import RegisterForm from '../../components/auth/registerForm'
import Layout from '../../components/layout/layout'
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
    .required('A Password is required.'),
  passwordConfirmation: yup
    .string()
    .min(5)
    .max(16)
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Please confirm your password."),
  username: yup
    .string()
    .min(5)
    .max(10)
    .required()
})


export default function Register() {

  const dispatch =  useDispatch();
  const [registerError, setRegisterError] = useState(null)
  const handleRegister = async (user) => {
    const resp = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user
      })
    })
    const json = await resp.json()

    if (json.status == 201) {
      dispatch(setUser(json))
      cookie.set("token", json.user.token, { expires: 600 });
      Router.push('/dashboard')
    } else {
      setRegisterError(json.message)
    }
  }

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: { email: '', password: '', username: '', passwordConfirmation: '' },
    validationSchema,
    onSubmit(values){ handleRegister(values) }

  })
  return (
    <Layout>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={utilStyles.form}>
        <p className={utilStyles.errorMessage}>
          {registerError && registerError}
        </p>
        <RegisterForm 
          onSubmit={handleSubmit}
          errors={errors}
          values={values}
          onChange={handleChange}
        />
        <p>To login, click <Link href="/auth/login"><a>Login</a></Link></p>
      </div>
    </Layout>
  )
}