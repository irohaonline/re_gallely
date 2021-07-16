import currentUserState from '../recoil/atoms/currentUserState';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';
import getUserByID from '../api/UserAPI/getUserByID';
import { useRouter } from 'next/router';
import routes from '../constants/routes';
import createProfile from '../api/ProfileAPI/createProfile';
import { UserProfile } from '../types/User';
import setProfile from '../api/ProfileAPI/setProfile';

const auth = firebase.auth();

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [firebaseUser, firebaseLoading, error] = useAuthState(auth);
  const router = useRouter();

  const loadUser = () => {
    getUserByID(firebaseUser.uid).then((user) => {
      if (!user) {
        // profile setup is not completed
        // -> redirect to profile setup page
        if (router.pathname !== routes.welcome) {
          router.push(routes.welcome);
        }
      } else {
        setCurrentUser(user);
      }
    });
  };

  // load user if atom state is not loaded yet
  useEffect(() => {
    if (firebaseLoading) {
      return;
    }
    if (!firebaseUser) {
      // not signed in
      setCurrentUser(null);
    } else if (!currentUser) {
      // signed in but user is not loaded yet
      loadUser();
    }
  }, [firebaseUser, firebaseLoading]);

  const setup = async (profile: UserProfile): Promise<void> => {
    if (!firebaseUser) {
      return;
    }
    return createProfile(firebaseUser, profile);
  };

  const updateProfile = async (profile: UserProfile): Promise<void> => {
    if (!firebaseUser) {
      return;
    }
    await setProfile(firebaseUser, profile);

    // reload profile on successful update
    loadUser();
  };

  const signOut = () => {
    if (!firebaseUser) return;
    return auth.signOut();
  };

  return {
    currentUser: currentUser || null,
    firebaseUser,
    loading: typeof currentUser === 'undefined' || firebaseLoading,
    error,
    setup,
    updateProfile,
    signOut,
  };
};

export default useCurrentUser;
