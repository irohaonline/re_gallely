import React, { FC } from 'react';
import styles from './ImagePreview.module.scss';

type Props = {
  undoPost(id: string): Promise<any>;
  id: string;
  path: string;
};

const ImagePreview: FC<Props> = (props: Props) => {
  return (
    <div
      className={styles.imageThumbnail_cover}
      onClick={() => props.undoPost(props.id)}
    >
      <img
        alt="アイキャッチ画像"
        src={props.path}
        className={styles.imageThumbnail}
      />
    </div>
  );
};

export default ImagePreview;
