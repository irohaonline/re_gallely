import React, { FC, useMemo } from 'react';
import Link from 'next/link';

import styles from './Footer.module.scss';
import { useTranslation } from 'react-i18next';

const yearBegin = 2021;

const Footer: FC = () => {
  const { t } = useTranslation();

  const copyRightYear = useMemo<string>(() => {
    const thisYear = new Date().getFullYear();
    return thisYear <= yearBegin
      ? String(thisYear)
      : `${yearBegin} - ${thisYear}`;
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.copy}>
          &copy; {copyRightYear}
          <a href="https://tabularsa.com" target="_blank">
            Tabularsa LLC
          </a>
        </div>
        <ul className={styles.menu}>
          <li>
            <Link href="/terms-of-service" >
              <a>{t('termsOfService')}</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" >
              <a>{t('privacyPolicy')}</a>
            </Link>
          </li>
          <li>
            <a href="https://tabularsa.com" target="_blank">
              {t('operatingCompany')}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
