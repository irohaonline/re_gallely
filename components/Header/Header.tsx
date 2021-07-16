import React, { FC, useCallback, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import HeaderMenu from './HeaderMenu';

import styles from './Header.module.scss';

import routes from '../../constants/routes';
import useCurrentUser from '../../hooks/useCurrentUser';
import Link from 'next/link';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuBar: {
      backgroundColor: '#fff',
      color: '#444',
    },
    toolbar: {
      margin: '0 auto',
      maxWidth: 1024,
      width: '100%',
    },
    iconButtons: {
      margin: '0 0 0 auto',
    },
  })
);

const Header: FC = () => {
  const { currentUser, loading, firebaseUser } = useCurrentUser();
  const classes = useStyles();

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const handleDrawerToggle = useCallback(
    (event, isOpen) => {
      if (
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return;
      }
      setSideBarOpen(isOpen);
    },
    [setSideBarOpen]
  );



  return (
    <header className={styles.header}>
      <div className="container">
        <h1 className={styles.logo}>
          <Link href={routes.home}>
            <a>Outis</a>
          </Link>
        </h1>
        <nav className={styles.menu}>
          {currentUser && (
            <Toolbar className={classes.toolbar}>
              <div className={classes.iconButtons}>
                <HeaderMenu handleDrawerToggle={handleDrawerToggle} />
              </div>
            </Toolbar>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
