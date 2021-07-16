import React, { useEffect } from 'react';
import SignIn from '../components/SignIn';
import Head from 'next/head';
import useCurrentUser from '../hooks/useCurrentUser';
import routes from '../constants/routes';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../components/LoadingScreen';

const Join: NextPage = () => {
  const { t } = useTranslation();
  const { firebaseUser, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already authenticated
    if (firebaseUser) {
      router.push(routes.home);
    }
  }, [firebaseUser, loading]);

  if (loading || firebaseUser) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Head>
        <title>{t('joinPolcle')}</title>
      </Head>
      <SignIn />
    </>
  );
};

export default Join;
