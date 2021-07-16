import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import firebase from '../utils/firebase';
import useCurrentUser from '../hooks/useCurrentUser';
import collections from '../api/utils/collections';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import routes from '../constants/routes';
import { Link } from '@material-ui/core';
import Header from '../components/Header/Header';

import styles from '../styles/components.module.scss';
import Layout from '../components/Layouts/Layout';
import Footer from '../components/Layouts/Footer';
import LoadingScreen from '../components/LoadingScreen';

const schema = yup.object().shape({
  galleries: yup
    .string()
    .required()
    .trim()
    .matches(/[Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm)
    .max(20),
});

const db = firebase.firestore();

const Gallery = () => {
  const [galleries, setGalleries] = useState(null);
  const { currentUser } = useCurrentUser();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    if (!currentUser || submitting) {
      return alert('nothing');
    }
    router.push(routes.postGalleryID(currentUser.screenName, data.galleries));
    console.log(data);
  };

  useEffect(() => {
    if (currentUser) {
      db.collection(collections.galleries)
        .where('ownerID', '==', currentUser.id)
        .get()
        .then((docs) => {
          const list = [];
          docs.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: data.galleryID,
              name: data.name,
            });
          });
          setGalleries(list);
        });
    }
  }, [currentUser]);

  if (!galleries) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <div className="module-spacer--40px" />
      <div className="module-spacer--40px" />
      <div className="module-spacer--40px" />
      <h4 className=" center "> {t('chooseAGallery')}</h4>
      <div className="module-spacer--40px" />

      {/* gallery がなかったらまず作らせる */}
      {galleries.length ? (
        <div className=" container  d-flex justify-content-center align-items-center">
          <div className="w_100 center">
            <div className="module-spacer--40px" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group input-group-lg">
                <select
                  name="galleries"
                  ref={register}
                  className="form-control"
                >
                  {galleries.map((gallery) => (
                    <option value={gallery.id} key={gallery.id}>
                      {gallery.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="module-spacer--medium" />
              <div className="module-spacer--extra-small" />
              <div className="center">
                <button className={styles.customBtn} type="submit">
                  <span>{t('toGallery')}</span>
                </button>
              </div>
            </form>
            <div className="module-spacer--medium" />
            <div className="module-spacer--medium" />
            <div className="module-spacer--extra-small" />
            <div className="pull-right">
              <Link href="/studio" style={{ textDecoration: 'none' }}>
                <a style={{ textDecoration: 'none' }}>
                  <h6
                    className="center mx-auto text-white "
                    style={{ opacity: 0.8 }}
                  >
                    {t('createNewGallery')}
                  </h6>
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="center container ">
          <h2>
            <Link href={routes.studio} style={{ textDecoration: 'none' }}>
              <a style={{ color: '#86b1c1', textDecoration: 'none' }}>
                {t('createFirstGallery')}
              </a>
            </Link>
          </h2>
        </div>
      )}
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

export default Gallery;
