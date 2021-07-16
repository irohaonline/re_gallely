import React, { FC, useEffect, useState } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import Tippy from '@tippyjs/react';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import firebase from '../../utils/firebase';
import useCurrentUser from '../../hooks/useCurrentUser';
import collections from '../../api/utils/collections';
import { useRecoilState } from 'recoil';
import currentFavoriteState from '../../recoil/atoms/currentFavoritesState';
import Gallery from '../../types/Gallery';
import getGalleryByID from '../../api/GalleyAPI/getGalleyByID';
import routes from '../../constants/routes';
import getProductsByTagID from '../../api/ProductAPI/getProductsByTagID';
import Product from '../../types/Product';
import getUsersFavoritesByID from '../../api/UserAPI/UserFavoritesAPI/getUsersFavoritesByID';
import Favorite from '../../types/Favorite';
import { useRouter } from 'next/router';

import styles from './HeaderMenu.module.scss';
import { Badge, Drawer, IconButton, Link, makeStyles } from '@material-ui/core';

const db = firebase.firestore();
const galleryRef = db.collection(collections.galleries);
const tagsRef = db.collection(collections.tags);
const usersRef = db.collection(collections.users);
const favoritesRef = db.collection(collections.favotites);

type Props = {
  handleDrawerToggle: (event: any, isOpen: any) => void;
};

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const HeaderMenu: FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { currentUser, signOut } = useCurrentUser();
  const [drwrOpen, setDrwropen] = useState<boolean>(false);
  const [favoritesOpen, setFavoritesopen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[] | null>([]);
  const [productsList, setProductsList] = useState<Product[][] | null>([]);
  //[[pr1,pr2,...], [pr1,pr2,...]]
  const [favorites, setFavorites] = useState<Favorite[] | null>([]);
  const productsInFavorites: Favorite[] | null = favorites;

  const router = useRouter();

  const handleDrawerToggle = () => {
    setDrwropen(!drwrOpen);
  };

  const handleFavoritesToggle = () => {
    setFavoritesopen(!favoritesOpen);
  };

  const handleIsOpenToggle = () => {
    setIsOpen(!isOpen);
  };

  const fetchGalleries = async () => {
    const fetchedGalleriesDocs = await galleryRef
      .where('ownerID', '==', currentUser.id)
      .get();
    const fetchedGalleries = await Promise.all(
      fetchedGalleriesDocs.docs.map((doc) => getGalleryByID(doc.id))
    );
    setGalleries(fetchedGalleries);
    console.log(galleries);
  };

  const fetchProducts = async () => {
    const fetchedTagsDocs = await tagsRef
      .where('ownerID', '==', currentUser.id)
      .get();
    const fetchedProducts = await Promise.all(
      fetchedTagsDocs.docs.map((doc) => getProductsByTagID(doc.id))
    );
    setProductsList(fetchedProducts);
  };

  const fetchFavorites = async () => {
    const fetchedFavorites = await getUsersFavoritesByID(currentUser.id);
    setFavorites(fetchedFavorites);
  };

  const SignOutFunc = async () => {
    await signOut();
    router.push(routes.signIn);
  };

  //Listen in users favorites
  // useEffect(() => {
  //   if (currentUser) {
  //     const unsubscribe = usersRef
  //       .doc(currentUser.id)
  //       .collection(collections.favotites)
  //       .onSnapshot((snapshots) => {
  //         snapshots.docChanges().forEach((change) => {
  //           const product = change.doc.data();
  //           const changeType = change.type;

  //           switch (changeType) {
  //             case 'added':
  //               productsInCart.push(product);
  //               break;
  //             case 'modified':
  //               const index = productsInCart.findIndex(
  //                 (product) => product.cartId === change.doc.id
  //               );
  //               productsInCart[index] = product;
  //               break;
  //             case 'removed':
  //               productsInCart = productsInCart.filter(
  //                 (product) => product.cartId !== change.doc.id
  //               );
  //               break;
  //             default:
  //               break;
  //           }
  //         });
  //         dispatch(fetchProductsInCart(productsInCart));
  //       });

  //     return () => unsubscribe();
  //   }
  // }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchGalleries();
      fetchProducts();
      fetchFavorites();
    }
  }, [currentUser]);

  return (
    <>
      <IconButton onClick={() => router.push(routes.studio)}>
        <AddIcon style={{ color: '#86b1c1' }} />
      </IconButton>
      <Link href={routes.favorites(currentUser.screenName)}>
        <a>
          <IconButton onClick={handleFavoritesToggle}>
            <Badge badgeContent={favorites.length} color="primary">
              <BookmarkBorderIcon style={{ color: '#86b1c1' }} />
            </Badge>
          </IconButton>
        </a>
      </Link>
      <IconButton
        aria-label="Menu Items"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={() => handleDrawerToggle()}
      >
        <MenuIcon />
      </IconButton>

      {/* drawer */}
      <Drawer
        open={drwrOpen}
        anchor="right"
        onClose={() => handleDrawerToggle()}
      >
        <div className={styles.drawerWrapper}>
          <ul className="list-group">
            <li className="list-group-item p-0">
              <Link
                href={routes.userProfile(currentUser.screenName)}
                style={{ textDecoration: 'none' }}
              >
                <a style={{ display: 'block', textDecoration: 'none' }}>
                  <IconButton>
                    <AccountCircleIcon style={{ color: '#fff' }} />
                  </IconButton>
                  <span>account</span>
                </a>
              </Link>
            </li>
          </ul>

          <h3 className="px-2 pt-1" style={{ color: '#86b1c1' }}>
            Galleries
          </h3>

          <ul className={'list-group' + ' ' + styles.hierarchyMenu}>
            {galleries &&
              galleries.map((gallery) => (
                <>
                  <li
                    key={gallery.id}
                    className={'list-group-item' + ' ' + styles.parentLi}
                    onClick={() => handleIsOpenToggle()}
                  >
                    <Link
                      href={routes.galleryList(
                        currentUser.screenName,
                        gallery.id
                      )}
                      style={{ textDecoration: 'none' }}
                    >
                      <a>{gallery.name}</a>
                    </Link>
                  </li>
                </>
              ))}
            <li>
              <a
                onClick={() => {
                  SignOutFunc();
                }}
                className="pull-right"
              >
                <IconButton>
                  <ExitToAppIcon style={{ color: '#86b1c1' }} />
                </IconButton>
              </a>
            </li>
          </ul>
        </div>
      </Drawer>
    </>
  );
};
export default HeaderMenu;
