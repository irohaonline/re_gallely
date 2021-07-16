import { FC, useEffect, useMemo, useState } from 'react';
import User from '../../../types/User';
import { useTranslation } from 'react-i18next';
import UserIcon from '../../../components/UserIcon';
import { format } from 'date-fns';
import Link from 'next/link';
import SettingsIcon from '@material-ui/icons/Settings';

import styles from './UserProfile.module.scss';
import useCurrentUser from '../../../hooks/useCurrentUser';
import routes from '../../../constants/routes';

import collections from '../../../api/utils/collections';
import Tag from '../../../types/Tag';
import getTagsByUserID from '../../../api/TagAPI/getTagsByUserID';

import firebase from '../../../utils/firebase';

const db = firebase.firestore();
const tagsRef = db.collection(collections.tags);
const galleriesRef = db.collection(collections.galleries);
const usersRef = db.collection(collections.users);

type Props = {
  user: User;
};

const UserProfile: FC<Props> = ({ user }: Props) => {
  const { t } = useTranslation();
  const { currentUser, signOut } = useCurrentUser();
  const [galleriesNum, setGalleriesNum] = useState<number | null>(null);
  const [postsNum, setPostsNum] = useState<number | null>(null);
  const [favoritesNum, setFavoritesNum] = useState<number | null>(null);

  const joinedDate = useMemo(() => {
    return format(user.joinedAt, 'LLL do, yyyy');
  }, [user]);

  const fetchUserStats = async () => {
    // ギャラリー数
    const ownedGalleries = await galleriesRef
      .where('ownerID', '==', user.id)
      .get();
    const galleries = ownedGalleries.size;
    setGalleriesNum(galleries);
    console.log(galleries);

    // 投稿数
    const postedTags = await tagsRef.where('ownerID', '==', user.id).get();
    const posts = postedTags.size;

    setPostsNum(posts);

    //ブックマーク数
    const ownedFavorites = await usersRef
      .doc(currentUser.id)
      .collection(collections.favotites)
      .get();
    const favorites = ownedFavorites.size;
    setFavoritesNum(favorites);
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  return (
    <div className="container">
      <div className={styles.profileHeader}>
        <div className={styles.iconGroup}>
          <div className={styles.userIcon}>
            <UserIcon src={user} size={200} />
            {currentUser && currentUser.id === user.id && (
              <button type="button" className={`btn ${styles.exitBtn}`}>
                <Link href={routes.accountSettings}>
                  <a className="btn ">
                    <SettingsIcon style={{ fontSize: 45, color: '#86b1c1' }} />
                  </a>
                </Link>
              </button>
            )}
          </div>
        </div>
        {/* user status */}
        <div className={styles.profileBox}>
          <div className={styles.dFlex}>
            <div className={styles.stringData}>
              <h1 className={styles.displayName}>{user.displayName} </h1>
              <div className={styles.screenName}>@{user.screenName}</div>
              <p className={styles.bio}>{user.bio}</p>
              <div className={styles.since}>Since {joinedDate}</div>
            </div>
            {/* user data num */}
            {/* {galleriesNum && ( */}
            <ul className={styles.userStats}>
              <li>
                <h3>{galleriesNum}</h3>
                <span>{t('createdGalleries')}</span>
              </li>
              <li>
                <h3>{postsNum}</h3>
                <span>{t('posts')}</span>
              </li>
              <li>
                <h3>{favoritesNum}</h3>
                <span>{t('favorites')}</span>
              </li>
            </ul>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
