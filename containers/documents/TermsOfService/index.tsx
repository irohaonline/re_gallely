import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import TermsOfServiceJapanese from './Japanese';

import styles from '../Documents.module.scss';
import Layout from '../../../components/Layouts/Layout';

const TermsOfService: FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <Layout>
      <div className="container">
        <h1 className={styles.heading}>{t('termsOfService')}</h1>
        <div className={styles.content}>
          {i18n.language !== 'ja' && (
            <div className="alert alert-info">{t('notTranslated')}</div>
          )}
          <TermsOfServiceJapanese />
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
