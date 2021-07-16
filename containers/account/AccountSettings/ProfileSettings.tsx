import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AccountSettings.module.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  bioValidation,
  displayNameValidation,
  screenNameValidation,
} from '../../../validations';

import componentStyles from '../../../styles/components.module.scss';

const formSchema = yup.object().shape({
  displayName: displayNameValidation,
  screenName: screenNameValidation,
  bio: bioValidation,
});

const ProfileSettings: FC = () => {
  const { t } = useTranslation();
  const { currentUser, updateProfile } = useCurrentUser();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
    context: { currentScreenName: currentUser.screenName || '' },
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onSubmit = async (data) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateProfile({
        ...data,
        photoURL: currentUser.photoURL,
      });
    } catch (e) {
      console.error(e);
      toast.error(t('failedToUpdateProfile'));
    }
    toast.success(t('profileUpdated'));
    setIsProcessing(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.subHeading}>{t('profile')}</h2>
      <div className={styles.row}>
        <label htmlFor="inputDisplayName" className={styles.label}>
          {t('displayName')}
        </label>
        <input
          type="text"
          id="inputDisplayName"
          name="displayName"
          className={styles.input}
          ref={register}
          defaultValue={currentUser.displayName}
          disabled={isProcessing}
        />
      </div>
      {errors.displayName && (
        <div className="alert alert-danger mt-2">
          {errors.displayName.message}
        </div>
      )}

      <div className={styles.row}>
        <label htmlFor="inputScreenName" className={styles.label}>
          {t('screenName')}
        </label>
        <input
          type="text"
          id="inputScreenName"
          className={styles.input}
          name="screenName"
          ref={register}
          defaultValue={currentUser.screenName}
          disabled={isProcessing}
        />
      </div>
      {errors.screenName && (
        <div className="alert alert-danger mt-2">
          {errors.screenName.message}
        </div>
      )}

      <div className={styles.row}>
        <label htmlFor="inputBio" className={styles.label}>
          {t('bio')}
        </label>
        <textarea
          id="inputBio"
          className={styles.input}
          name="bio"
          rows={4}
          ref={register}
          defaultValue={currentUser.bio}
          disabled={isProcessing}
        />
      </div>
      {errors.bio && (
        <div className="alert alert-danger mt-2">{errors.bio.message}</div>
      )}

      <div className={styles.row}>
        <div className="center">
          <button
            type="submit"
            className={componentStyles.customBtn}
            disabled={isProcessing}
            style={{
              textDecoration: 'none',
              color: '#86b1c1',
              backgroundColor: '#2e6c83',
              border: 'none',
              width: '200px',
            }}
          >
            <span>{t('save')}</span>
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </form>
  );
};

export default ProfileSettings;
