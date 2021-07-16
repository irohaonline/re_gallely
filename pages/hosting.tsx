import { NextPage } from 'next';
import React from 'react';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import firebase from '../utils/firebase'
import collections from '../api/utils/collections';

const db = firebase.firestore();
const productRef = db.collection(collections.products)

const schema = yup.object().shape({
  hostingURL: yup
    .string()
    .required()
    .trim()
    .matches(/[Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm)
    .max(100),
});

const onSubmit = (data) =>{

}

const Hosting: NextPage = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <div className="container ">
      <div className="center_center h_100vh">
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">Example label</label>
            <input
              type="url"
              className="form-control"
              id="formGroupExampleInput"
              placeholder="Example input"
              name="hostingURL"
              ref={register}
            />
          </div>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput2">Another label</label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput2"
              placeholder="Another input"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hosting;
