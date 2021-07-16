import React, { useState, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';
import { NextPage } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import collections from '../api/utils/collections';
import useCurrentUser from '../hooks/useCurrentUser';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Link } from '@material-ui/core';
import Header from '../components/Header/Header';
import SignIn from '../components/SignIn';
import routes from '../constants/routes';
import styles from '../styles/components.module.scss';
import Footer from '../components/Layouts/Footer';

const auth = firebase.auth();

const schema = yup.object().shape({
  galleryName: yup
    .string()
    .required()
    .trim()
    .matches(/[Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm)
    .max(100),
});

const db = firebase.firestore();
const galleryRef = db.collection(collections.galleries);

const Studio: NextPage = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { t } = useTranslation();
  const { currentUser, firebaseUser, loading, setup } = useCurrentUser();

  const onSubmit = async (data) => {
    if (!currentUser || submitting) {
      return alert('nothing');
    }

    console.log(data);

    setSubmitting(true);

    const galleryDoc = galleryRef.doc();
    const galleryID = galleryDoc.id;

    await galleryDoc.set({
      galleryID: galleryID,
      name: data.galleryName,
      ownerID: currentUser.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    router.push(routes.gallery);

    setSubmitting(false);
  };

  //Login First
  useEffect(() => {
    if (loading) {
      return;
    }
    if (!currentUser) {
      // redirect to home if setup already completed
      router.push(routes.welcome);
    } else if (!firebaseUser) {
      // redirect to sign in page if not logged in yet
      router.push(routes.signIn);
    }
  }, [currentUser, firebaseUser, loading]);

  return (
    <>
      <Header />
      <div className="module-spacer--40px" />
      <div className="module-spacer--40px" />
      <div className="module-spacer--40px" />
      <h4 className=" center "> {t('createNewGallery')}</h4>
      <div className="module-spacer--40px" />

      <div className="container d-flex justify-content-center align-items-center">
        <div className="w_100">
          <div className="center mx-auto">
            <div className="module-spacer--40px" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Type Your Favorite Galleryname"
                ref={register}
                name="galleryName"
              />
            </div>
            <div className="module-spacer--medium" />
            <div className="module-spacer--extra-small" />
            <div className="module-spacer--extra-small" />
            <div className=" center ">
              <button className={styles.customBtn} type="submit">
                <span>{t('create')}</span>
              </button>
            </div>
          </form>
          <div className="module-spacer--medium" />
          <div className="module-spacer--medium" />
          <div className="module-spacer--extra-small" />
          <div className="pull-right">
            <Link href="/gallery" style={{ textDecoration: 'none' }}>
              <a style={{ textDecoration: 'none', opacity: 0.8 }}>
                <h6
                  className="center mx-auto text-white "
                  style={{ opacity: 0.8 }}
                >
                  {t('useExistingGallery')}{' '}
                </h6>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="module-spacer--medium" />
      <div className="module-spacer--medium" />
      <div className="module-spacer--medium" />
      <div className="module-spacer--medium" />
      <div
        className="module-spacer--medium"
        style={{ borderBottom: '1px solid #86b1c1' }}
      />
    </>
  );
};

export default Studio;
