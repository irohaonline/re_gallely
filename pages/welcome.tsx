import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCurrentUser from '../hooks/useCurrentUser';
import { useRouter } from 'next/router';
import routes from '../constants/routes';
import Header from '../components/Header/Header';

const schema = yup.object().shape({
  displayName: yup.string().required().trim().max(30),
  screenName: yup
    .string()
    .required()
    .trim()
    .matches(/^@?(\w){3,15}$/) // twitter username regex
    .max(15),
  bio: yup.string().trim().max(200),
});

const WelcomePage: NextPage = () => {
  const { t } = useTranslation();
  const { currentUser, firebaseUser, loading, setup } = useCurrentUser();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (currentUser) {
      // redirect to home if setup already completed
      router.push(routes.home);
    } else if (!firebaseUser) {
      // redirect to sign in page if not logged in yet
      router.push(routes.signIn);
    }
  }, [currentUser, firebaseUser, loading]);

  const onSubmit = async (data) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await setup({
      ...data,
      photoURL: firebaseUser.photoURL,
    });
    // redirect to home
    router.push(routes.home);
  };

  if (!firebaseUser || currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1>Welcome to Polcle</h1>
        <p>Let us know a bit more about you</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="inputDisplayName" className="form-label">
              Display name
            </label>
            <input
              type="text"
              name="displayName"
              className="form-control"
              id="inputDisplayName"
              ref={register}
            />
            {errors.displayName && (
              <div className="alert alert-warning mt-3" role="alert">
                {errors.displayName.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="inputScreenName" className="form-label">
              Screen name
            </label>
            <input
              type="text"
              name="screenName"
              className="form-control"
              id="inputScreenName"
              aria-describedby="screenNameHelp"
              ref={register}
            />
            <div id="screenNameHelp" className="form-text">
              must be unique for all users
            </div>
            {errors.screenName && (
              <div className="alert alert-warning mt-3" role="alert">
                {errors.screenName.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="inputBio" className="form-label">
              Bio
            </label>
            <textarea
              name="bio"
              className="form-control"
              id="inputBio"
              rows={4}
              ref={register}
            />
            {errors.bio && (
              <div className="alert alert-warning mt-3" role="alert">
                {errors.bio.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isProcessing}
          >
            Complete Sign up
          </button>
        </form>
      </div>
    </>
  );
};

export default WelcomePage;
