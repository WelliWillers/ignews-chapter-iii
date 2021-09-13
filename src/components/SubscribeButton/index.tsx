import { session, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {

  function handleSubscribe(){

    if(!session) {
      signIn('github');
      return;
    }

    // cria checkout stripe
    
  }

  return (
    <button type="button" className={styles.button}>
      Subscribe now
    </button> 
  );
};
