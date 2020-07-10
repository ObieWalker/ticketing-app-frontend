import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getId } from '../lib/landing'

export default function Home({homeData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{homeData.params.title}</p>
        <p>
          <p>To Login, click <Link href="/auth/login"><a>Login</a></Link></p>
          <p>To regiter, click <Link href="/auth/register"><a>Register</a></Link></p>
        </p>
        <Link href="/posts/[id]" as={`/posts/${homeData.params.id}`}>
          <a>{homeData.params.title}</a>
        </Link>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const homeData = getId()
  return {
    props: {
      homeData
    }
  }
}