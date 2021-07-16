import React, { useState, useCallback, useEffect, FC } from 'react';

import { NextPage } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DropzoneArea } from 'material-ui-dropzone';
import { useRouter } from 'next/router';

import styles from './PostComponent.module.scss';
import buttonStyles from '../../styles/components.module.scss';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import Tippy, { tippy } from '@tippyjs/react';
import useCurrentUser from '../../hooks/useCurrentUser';
import collections from '../../api/utils/collections';
import firebase from '../../utils/firebase';
import routes from '../../constants/routes';

const schema = yup.object().shape({
  tagName: yup
    .string()
    .required()
    .trim()
    .matches(/[Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm)
    .max(20),
  productName: yup
    .string()
    .required()
    .trim()
    .matches(/[Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm)
    .max(20),
  caption: yup
    .string()
    .required()
    .trim()
    .max(30),
  hostingURL: yup.string().trim().max(100),
});

const db = firebase.firestore();
const storage = firebase.storage();

type UploadedImage = {
  fileName: string;
  url: string;
};

type Props = {
  galleryID?: string;
};

const PostComponent: FC<Props> = ({ galleryID }: Props) => {
  const [files, setFiles] = useState([]);
  const { currentUser } = useCurrentUser();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { t } = useTranslation();

  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [galleries, setGalleries] = useState([]);

  const uploadImage = useCallback((file): Promise<UploadedImage> => {
    const fileName = uuidv4();

    const uploadRef = storage.ref('images').child(fileName);
    const uploadTask = uploadRef.put(file);

    return new Promise(function (resolve, reject) {
      uploadTask.on(
        'state_changed',
        () => {},
        function error(err) {
          console.log('error', err);
          reject();
        },
        function complete() {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const newImage: UploadedImage = { fileName, url: downloadURL };
            resolve(newImage);
          });
        }
      );
    });
  }, []);

  const onSubmit = async (data) => {
    if (!currentUser || submitting) {
      return alert('nothing');
    }
    if (!files.length) {
      return alert('Choose Your Thumbnail');
    } else if (!data.productName || !data.caption || !data.tagName) {
      return alert('Please Type required item');
    } else {
      console.log(data);

      setSubmitting(false);

      const images = await Promise.all(files.map((file) => uploadImage(file)));

      const tagDoc = db.collection(collections.tags).doc();

      await tagDoc.set({
        name: data.tagName,
        ownerID: currentUser.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await db.collection(collections.products).doc(images[0].fileName).set({
        //input&select
        id: images[0].fileName,
        name: data.productName,
        caption: data.caption,
        galleryID,
        url: images[0].url,
        tagID: tagDoc.id,
        ownerID: currentUser.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        hosting: data.hostingURL,
      });

      setSubmitting(true);
      router.push(routes.galleryList(currentUser.screenName, galleryID));
    }
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

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-3">
        <div className="module-spacer--extra-small" />
        <div className="module-spacer--extra-small" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="form-control form-control-md"
            name="productName"
            required={true}
            type="text"
            ref={register}
            autoFocus={true}
            placeholder="Name Your Product"
          />
          <div className="module-spacer--extra-small" />
          <DropzoneArea
            classes={{ root: 'mt-4' }}
            acceptedFiles={['image/*']}
            dropzoneText={'Choose Your Thumbnail'}
            onChange={setFiles}
            maxFileSize={4000000}
            filesLimit={1}
            showPreviews={true}
            showPreviewsInDropzone={false}
          />
          <div className="module-spacer--extra-small" />

          <div className="d-flex">
            <input
              type="text"
              className="form-control form-control-md"
              placeholder="Product Theme or Genre"
              name="tagName"
              ref={register}
              autoFocus={true}
            />
          </div>
          <div className="module-spacer--extra-small" />

          <textarea
            className="form-control form-control-md"
            name="caption"
            required={true}
            ref={register}
            autoFocus={true}
            placeholder="Drop a Caption for Your Product"
          />
          <div className="module-spacer--extra-extra-small" />
          <div className="module-spacer--extra-extra-small" />
          <div className="center mt-4">
            {/* modal trigger */}
            <label htmlFor="trigger" className={buttonStyles.customBtn}>
              <span>{t('next')}</span>
            </label>
          </div>

          {/* <!-- Button trigger modal --> */}
          <>
            <div className={styles.modalWrap}>
              <input className="d-none" id="trigger" type="checkbox" />
              <div className={styles.modalOverlay}>
                <label
                  htmlFor="trigger"
                  className={styles.modalTrigger}
                ></label>
                <div className={styles.modalContent}>
                  <label htmlFor="trigger" className={styles.closeButton}>
                    ✖️
                  </label>
                  <h3 className="mb-2">{t('setHostingURL')}</h3>
                  <p className="ml-2" style={{ lineHeight: '1.8em' }}>
                    {t('setHostingURLContent')}
                  </p>

                  <Tippy content={t('optional')} offset={[0, 10]}>
                    <input
                      className="form-control form-control-md"
                      autoFocus={true}
                      id="hostingURL"
                      type="url"
                      name="hostingURL"
                      pattern="https://.*"
                      placeholder="URL  https://example.com"
                      ref={register}
                    />
                  </Tippy>

                  <div className="module-spacer--small" />
                  <button
                    type="submit"
                    className="btn btn-md btn-secondary pull-right"
                    disabled={submitting}
                  >
                    Host
                  </button>
                </div>
              </div>
            </div>
          </>
        </form>
      </div>
    </>
  );
};

export default PostComponent;
