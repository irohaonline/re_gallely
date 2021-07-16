import { FC } from 'react';
import User, { isUser } from '../../types/User';

import styles from './UserIcon.module.scss';

type Props = {
  src: User | string;
  size?: number;
};

const UserIcon: FC<Props> = ({ src, size = 50 }: Props) => {
  const url = isUser(src) ? src.photoURL : src;
  const alt = isUser(src) ? src.displayName : 'user icon';

  return (
    <img
      src={url.replace('_normal', '')}
      alt={alt}
      className={styles.userIcon}
      width={size}
      height={size}
    />
  );
};

export default UserIcon;
