import { FC } from 'react';

import styles from './LoadingScreen.module.scss';

const LoadingScreen: FC = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.logoBox}>
        <div className={styles.spinner}>
          <div className={styles.spinnerInner} />
        </div>
        <p>remember to smile</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
