import React, { useEffect, useState } from 'react';
import collections from '../../../api/utils/collections';
import useCurrentUser from '../../../hooks/useCurrentUser';
import getUsersFavoritesByID from '../../../api/UserAPI/UserFavoritesAPI/getUsersFavoritesByID';
import { useTranslation } from 'react-i18next';

import firebase from '../../../utils/firebase';
import Header from '../../../components/Header/Header';
import { Paper } from '@material-ui/core';
import Favorite from '../../../types/Favorite';
import ProductCard from '../../../components/Products/ProductCard';
import LoadingScreen from '../../../components/LoadingScreen';

const db = firebase.firestore();
const usersRef = db.collection(collections.users);

const Favorites = () => {
  const { currentUser } = useCurrentUser();
  const [products, setProducts] = useState<Favorite[] | null>([]);
  const { t } = useTranslation();

  const fetchFavoritesProducts = async () => {
    const fetchedProducts: Favorite[] | null = await getUsersFavoritesByID(
      currentUser.id
    );
    console.log(fetchedProducts);

    setProducts(fetchedProducts);

    console.log(products);
  };

  useEffect(() => {
    if (currentUser) {
      fetchFavoritesProducts();
    }
  }, [currentUser]);

  if (!products) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <div className="container section-wrapin">
        <div className="module-spacer--medium" />
        <h2 className="center mx-auto my-0" style={{ height: '40px' }}>
          {t('bookmark')}
        </h2>
        <div className="module-spacer--medium" />
        <div className="module-spacer--medium" />

        <div className="d-flex flex-wrap" style={{ minHeight: '100vh' }}>
          {products &&
            products.map((product) => (
              <ProductCard product={product.product} key={product.id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Favorites;
