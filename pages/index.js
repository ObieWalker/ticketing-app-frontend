import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout/layout'
import utilStyles from '../styles/utils.module.css'
import { getId } from '../lib/landing'

export default function Home({homeData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
          <p>To Navigate to your dashboard, click <Link href="/auth/login"><a>Here</a></Link></p>
          <p>To register, click <Link href="/auth/register"><a>Register</a></Link></p>
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