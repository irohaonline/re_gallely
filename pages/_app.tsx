import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { RecoilRoot } from 'recoil';
import { useTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import 'tippy.js/animations/scale.css';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/light.css';
import 'react-toastify/dist/ReactToastify.min.css';

import firebase from '../utils/firebase';

import '../utils/i18n';

import 'sanitize.css';
import '../styles/globals.scss';
import '../styles/MUIStyleFixer.scss';
import { Router, useRouter } from 'next/router';
import { Link } from '@material-ui/core';

const LOCALE_COOKIE = 'locale';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { i18n } = useTranslation();

  // detect locale from cookie on first page load
  useEffect(() => {
    const localeFromCookie = Cookies.get(LOCALE_COOKIE);
    if (localeFromCookie && localeFromCookie !== i18n.language) {
      i18n.changeLanguage(localeFromCookie === 'en' ? 'en' : 'ja');
    }
  }, []);

  // update locale cookie
  useEffect(() => {
    Cookies.set('locale', i18n.language);
  }, [i18n.language]);

  return (
    <RecoilRoot>
      <Head>
        <title />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
