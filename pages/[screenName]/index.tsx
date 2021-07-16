import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layouts/Layout';
import UserProfile from '../../containers/users/UserProfile';
import User from '../../types/User';
import getUserByScreenName from '../../api/UserAPI/getUserByScreenName';

interface Props {
  user: User;
}

const UserPage: NextPage<Props> = ({ user }: Props) => (
  <Layout>
    <Head>
      <title>{user.displayName} - Polcle</title>
    </Head>
    <UserProfile user={user} />
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const screenName = params.screenName;
  if (typeof screenName !== 'string') {
    // screen name is invalid
    return {
      notFound: true,
    };
  }

  // fetch user by screen name
  const user = await getUserByScreenName(screenName);
  if (!user) {
    // user not found
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default UserPage;
