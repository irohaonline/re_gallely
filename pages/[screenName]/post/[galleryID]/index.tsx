import { GetStaticPaths, GetStaticProps, NextPage } from 'next';


import Header from '../../../../components/Header/Header';
import PostComponent from '../../../../components/Products/PostComponent';


interface Props {
  galleryID: string;
}

const postGalleryID: NextPage<Props> = ({ galleryID }: Props) => {
  return (
    <>
      <Header />
      <PostComponent galleryID={galleryID} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const galleryID = params.galleryID;
  if (typeof galleryID !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      galleryID,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default postGalleryID;
