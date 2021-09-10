import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss'

export function SignInButton(){
    const isLoger = true;
    
    return isLoger ? (
        <button type="button" className={styles.button}>
            <FaGithub color="#04d361"/>
            Wellington Willers
            <FiX className={styles.closeIcon}/>
        </button>
    ) : (
        <button type="button" className={styles.button}>
            <FaGithub color="#eba417"/>
            Entrar com Github
        </button>
    )
    
}