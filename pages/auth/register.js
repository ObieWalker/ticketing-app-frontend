import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout'

export default function Login() {
  return (
    <Layout>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Login</h1>
      <p>To regiter, click <Link href="/auth/login"><a>Login</a></Link></p>
    </Layout>
  )
}