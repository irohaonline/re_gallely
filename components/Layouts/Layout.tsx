import React, { ReactNode, FC } from 'react';
import classNames from 'classnames';

import Header from '../Header/Header';
import Footer from './Footer';

import styles from './Layout.module.scss';

type Props = {
  centerContent?: boolean;
  children: ReactNode;
};

const Layout: FC<Props> = ({ centerContent, children }: Props) => {
  const containerClasses = classNames(styles.pageContainer, {
    [styles.centerContent]: centerContent,
  });

  return (
    <div className={containerClasses}>
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
