import React, { FC, useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from '@material-ui/core';
import Product from '../../types/Product';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Modal from 'react-modal';

import firebase from '../../utils/firebase';
import { toFirestore } from '../../api/UserAPI/UserFavoritesAPI/userFavoriteConverter';
import collections from '../../api/utils/collections';
import useCurrentUser from '../../hooks/useCurrentUser';
import getTagByID from '../../api/TagAPI/getTagByID';

import styles from './ProductCard.module.scss';
import Tag from '../../types/Tag';
import getUserByID from '../../api/UserAPI/getUserByID';
import User from '../../types/User';
import { format } from 'date-fns';

Modal.setAppElement('#__next');

// スタイリング
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  content: {
    top: '50%',
    right: 'auto',
    bottom: 'auto',
    left: '50%',
    width: '500px',
    height: '300px',
    padding: 0,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const db = firebase.firestore();

type Props = {
  product: Product;
  galleryName?: string;
};

const ProductCard: FC<Props> = ({ product, galleryName }: Props) => {
  //modalmodalmodal
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [tag, setTag] = useState<Tag | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [owner, setOwner] = useState<User | null>(null);
  const { currentUser } = useCurrentUser();
  console.log(product.createdAt);

  const productDisplayedDate = useMemo(() => {
    return format(product.createdAt, 'LLL do, yyyy');
  }, [product]);

  // モーダルを開く処理
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {
    // モーダルが開いた後の処理
  };

  // モーダルを閉じる処理
  const closeModal = () => {
    setIsOpen(false);
  };

  const addProductToFavorite = async () => {
    const userFavoriteRef = db
      .collection(collections.users)
      .doc(currentUser.id)
      .collection(collections.favotites)
      .doc();

    await userFavoriteRef.set(
      toFirestore({
        id: currentUser.id,
        addedAt: new Date(),
        product,
      })
    );
    setSubmitted(true);
    alert('woohoo! you added product to favorite');
  };

  const fetchUser = async () => {
    const fetchedUser: User = await getUserByID(product.ownerID);
    setOwner(fetchedUser);
  };

  const fetchTag = async () => {
    const fetchedTag: Tag = await getTagByID(product.tagID);
    setTag(fetchedTag);
  };

  useEffect(() => {
    if (product) {
      fetchUser();
      fetchTag();
    }
  }, [product]);

  return (
    //modalmodalmodal
    <>
      {owner && tag && (
        <>
          <Modal
            // isOpenがtrueならモダールが起動する
            isOpen={modalIsOpen}
            // モーダルが開いた後の処理を定義
            onAfterOpen={afterOpenModal}
            // モーダルを閉じる処理を定義
            onRequestClose={closeModal}
            // スタイリングを定義
            style={customStyles}
          >
            <ul className="list-group">
              <li className="list-group-item mt-2">
                <span className="mr-3">展示した人 </span>
                {owner.displayName}
              </li>
              <li className="list-group-item">
                <span className="mr-3">展示した日 </span>
                {productDisplayedDate}
              </li>
              <li className="list-group-item">
                <span className="mr-3">タグ </span>
                {tag.name}
              </li>
              <li className="list-group-item">
                <span className="mr-3">リンク </span>
                {product.hosting ? (
                  <Link href={product.hosting}>
                    <a>{product.hosting}</a>
                  </Link>
                ) : (
                  <small>URLは設定されていません</small>
                )}
              </li>
            </ul>
            <button
              onClick={() => {
                closeModal();
              }}
              className="btn btn-secndary pull-right mr-5 mt-3"
            >
              close
            </button>
          </Modal>

          {/* // img */}
          <div
            className={styles.card}
            style={{ width: '18rem', border: 'none' }}
          >
            <div>
              <a className={styles.imgHolder}>
                <img
                  className="bd-placeholder-img card-img-top"
                  src={product.url}
                  onClick={openModal}
                />
              </a>
            </div>

            {/* card body */}
            <div className="card-body">
              <div className="d-flex flex-column justify-content-around pt-2">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.caption}</p>

                <div className=" center">
                  {product.hosting ? (
                    <Link href={product.hosting}>
                      <a
                        className={
                          'btn' + ' ' + 'btn-secondary' + ' ' + styles.visitBtn
                        }
                      >
                        JUMP
                      </a>
                    </Link>
                  ) : (
                    <a
                      className={
                        'btn' + ' ' + 'btn-secondary' + ' ' + styles.visitBtn
                      }
                      onClick={() => {
                        alert('URLは設定されてされていません');
                      }}
                    >
                      JUMP
                    </a>
                  )}
                </div>

                <div style={{ width: '100%' }}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addProductToFavorite()}
                    disabled={submitted}
                    className="pull-right ml-2"
                  >
                    <BookmarkBorderIcon />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductCard;
