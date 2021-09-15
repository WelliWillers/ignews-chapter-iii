import { session, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {

  async function handleSubscribe(){

    if(!session) {
      signIn('github');
      return;
    }

    // cria checkout stripe
    try { 
      console.log('index');
      
      const response = await api.post('/subscribe');

      console.log('index02');
      

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
      
    } catch (error) {

      alert(error.message);
      
    }
  }

  return (
    <button 
      type="button" 
      className={styles.button} 
      onClick={handleSubscribe}
    >
      Subscribe now
    </button> 
  );
};
