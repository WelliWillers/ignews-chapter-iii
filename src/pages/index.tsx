import Head from 'next/head';

import { GetStaticProps } from 'next';

import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss'
import { stripe } from '../services/stripe';

interface productProps {
  product: {
    priceId: string,
    amount: string,
  }
}

export default function Home({product}: productProps) {

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
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="" />
      </main>

    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1JXwr6APQXfwPbXiRsNBn8xi')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100) ,
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, //24 horas 
  }
}