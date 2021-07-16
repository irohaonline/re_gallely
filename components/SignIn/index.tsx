import React, { FC } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

import { twitterProvider, googleProvider } from '../../auth/authProvider';

import firebase from '../../utils/firebase';
import Layout from '../Layouts/Layout';

import styles from './SignIn.module.scss';

const SignIn: FC = () => {
  const { t } = useTranslation();

  const authWithProvider = (provider: firebase.auth.AuthProvider) =>
    firebase.auth().signInWithRedirect(provider);

  return (
    <Layout>
      <Head>
        <title>join galalleies</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>ギャラリーズにJOIN</h1>
          {/* <p>{t('chooseService')}</p> */}
          <div className="module-spacer--small"/>
          <div className={styles.card_header}>
            {/* <button
              className={`${styles.signInButton} ${styles.signInButton_twitter}`}
              onClick={() => authWithProvider(twitterProvider)}
            >
              {t('signInWith', { service: 'Twitter' })}
            </button> */}
            <button
              className={`${styles.signInButton} ${styles.signInButton_google}`}
              onClick={() => authWithProvider(googleProvider)}
            >
              {t('signInWith', { service: 'Google' })}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
