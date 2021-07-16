import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header/Header';
import useCurrentUser from '../hooks/useCurrentUser';
import { useRouter } from 'next/router';
import routes from '../constants/routes';

import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const { currentUser, firebaseUser, loading } = useCurrentUser();
  const router = useRouter();

  const InFunc = () => {
    if (loading) {
      return;
    }
    if (!currentUser) {
      // redirect to welcome if setup already completed
      router.push(routes.welcome);
    } else if (!firebaseUser) {
      // redirect to sign in page if not logged in yet
      router.push(routes.signIn);
    } else {
      router.push(routes.studio);
    }
  };

  return (
    <>
      <Head>
        <title>outis</title>
      </Head>
      <div className={styles.body}>
        <Header />
        <div className={styles.bluelight}>
          <a
            onClick={InFunc}
            style={{
              cursor: 'pointer',
            }}
          >
            IN
          </a>
        </div>
        <p className={styles.caption}>GALLERY CORE ENGINE</p>
      </div>
    </>
  );
};

export default Home;
