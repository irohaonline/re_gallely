import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../../components/LoadingScreen';
import Layout from '../../../components/Layouts/Layout';
import { useRouter } from 'next/router';
import routes from '../../../constants/routes';
import useCurrentUser from '../../../hooks/useCurrentUser';
import Head from 'next/head';

import styles from './AccountSettings.module.scss';
import ProfileSettings from './ProfileSettings';
import LanguageSettings from './LanguageSettings';

const AccountSettings: FC = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useCurrentUser();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  // redirect to home if not signed in
  if (!currentUser) {
    router.push(routes.home);
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>{t('accountSettings')}</title>
      </Head>
      <div className={`container ${styles.accountSettings}`}>
        <h1 className={styles.heading}>{t('accountSettings')}</h1>

        <ProfileSettings />

        <LanguageSettings />
      </div>
    </Layout>
  );
};

export default AccountSettings;
