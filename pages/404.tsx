import { NextPage } from 'next';
import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';

import Layout from '../components/Layouts/Layout';
import routes from '../constants/routes';
import LinkText from '../components/LinkText';

import styles from '../styles/Custom404.module.scss';
import Header from '../components/Header/Header';

const Custom404: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="module-spacer--medium" />
      <div className="module-spacer--medium" />
      <div className={`container ${styles.notFound}`}>
        <h1>{t('notFoundPage.heading')}</h1>
        <p>{t('notFoundPage.description')}</p>
        <Link href={routes.home}>
          <a className="btn btn-primary btn-lg">{t('backToHome')}</a>
        </Link>
        <p>
          <Trans
            i18nKey="notFoundPage.contactUs"
            components={{
              contactLink: (
                <LinkText
                  href="https://tabularsa.com/contact/"
                  target="_blank"
                />
              ),
            }}
          />
        </p>
      </div>
    </>
  );
};

export default Custom404;
