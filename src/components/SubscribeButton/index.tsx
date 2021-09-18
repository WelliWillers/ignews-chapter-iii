import { session, signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {

  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe(){

    if(!session) {
      signIn('github');
      return;
    }

    if(session.activeSubscription){
      router.push('/posts');
      return;
    }

    // cria checkout stripe
    try { 
      const response = await api.post('/subscribe');

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
