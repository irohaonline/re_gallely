import Photo from '../../types/Photo';
import React, { FC, useEffect, useState, useMemo } from 'react';

import Tag from '../../types/Tag';
import getPhotosByTagID from '../../api/PhotoAPI/getPhotosByTagID';

import Head from 'next/head';
import Layout from '../../components/Layouts/Layout';

type Props = {
  photos: Photo[];
};

const Vote: FC<Props> = ({ photos }: Props) => {

  const [i, setI] = useState<number>(0);
  const [j, setJ] = useState<number>(photos.length - 1);
  const [orderedPhotos, setOrderedPhotos] = useState<Photo[]>(photos);

  const leftPhoto = useMemo(() => orderedPhotos[j], [j, orderedPhotos]);
  const rightPhoto = useMemo(() => orderedPhotos[j - 1], [j, orderedPhotos]);

  console.log(photos);



  const handlePhotoSelect = (selectedPhoto: Photo) => {
    console.log(`selected photo: ${selectedPhoto.id}`);

    if (selectedPhoto.id === leftPhoto.id) {
      const tmpArray = orderedPhotos;
      const tmp = rightPhoto;
      tmpArray[j - 1] = leftPhoto;
      tmpArray[j] = tmp;
      setOrderedPhotos(tmpArray);
    }

    console.log(i, j, orderedPhotos);

    if (j <= i + 1) {
      // 内部ループ終了
      setI(i + 1);
      setJ(photos.length - 1);
    } else {
      setJ(j - 1);
    }
  };

  if (photos.length === 0) {
    return <div>Loading...</div>;
  }


  if (i + 1 >= orderedPhotos.length) {
    return (
        <div className="container">
          <h1>Result</h1>
          {orderedPhotos.map((p) => (
            <img key={p.id} src={p.url} alt="photo" />
          ))}
        </div>
    );
  }

  return (
      <div className="container">
        <Head>
          <title>Polcle</title>
        </Head>

        <h1>Welcome to Polcle</h1>
        <div className="d-flex">
          <button type="button" onClick={() => handlePhotoSelect(leftPhoto)} style={{maxWidth: "45%"}}>
            <img src={leftPhoto.url} alt="photo"  style={{maxWidth: "100%"}}/>
          </button>

          <button
            type="button"
            onClick={() => handlePhotoSelect(rightPhoto)}
            className="ml-2"
            style={{maxWidth: "45%"}}
          >
            <img src={rightPhoto.url} alt="photo" style={{maxWidth: "100%"}}/>
          </button>
        </div>
      </div>
  );
};

export default Vote;
