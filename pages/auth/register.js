import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout'
import RegisterWrapper from './RegisterWrapper'

export default function Login() {
  return (
    <Layout>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Please Register.</h1>
      <RegisterWrapper/>
      <p>To login, click <Link href="/auth/login"><a>Login</a></Link></p>
    </Layout>
  )
}