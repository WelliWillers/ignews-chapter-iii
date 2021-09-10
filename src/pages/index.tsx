import Head from 'next/head';

import { GetServerSideProps } from 'next';

import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss'

export default function Home(props) {


  console.log(props);

  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 🙌 Hey, welcome </span>
          <h1> News about the <span>React</span> world. </h1>
          <p>
            Get acess to all publications <br />
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="" />
      </main>

    </>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      nome: 'welli',
    }
  }
}