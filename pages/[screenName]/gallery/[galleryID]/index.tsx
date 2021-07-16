import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from 'next';

import Product from '../../../../types/Product';
import getGalleiedProductsByID from '../../../../api/ProductAPI/getGalleiedProductsByID';

import getGalleryByID from '../../../../api/GalleyAPI/getGalleyByID';
import ProductCard from '../../../../components/Products/ProductCard';
import { ParsedUrlQuery } from 'querystring';
import normalizeScreenName from '../../../../utils/normalizeScreenName';
import routes from '../../../../constants/routes';
import Header from '../../../../components/Header/Header';


interface Props {
  products: Product[];
  galleryName: string;
}

const GalleiedProductsPage: NextPage<Props> = ({
  products,
  galleryName,
}: Props) => {
  console.log(products);
  return (
    <>
      <Header />
      <div className="container section-wrapin">
        <div className="module-spacer--medium" />
        <h2
          className="center mx-auto my-0"
          style={{ height: '40px' }}
        >
          {galleryName}
        </h2>
        <div className="module-spacer--medium" />
        <div className="module-spacer--medium" />

        <div className="d-flex flex-wrap" style={{ minHeight: '100vh' }}>
          {products &&
            products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </>
  );
};

export const parseUserAndGallery = async (
  params: ParsedUrlQuery
): Promise<GetStaticPropsResult<Props>> => {
  const { screenName, galleryID } = params;
  if (typeof screenName !== 'string' || typeof galleryID !== 'string') {
    // page params are invalid
    return {
      notFound: true,
    };
  }

  //fetch gallery data by galleryID
  const galleryData = await getGalleryByID(galleryID);
  const galleryName = galleryData.name;

  // fetch products by galleryID
  const products = await getGalleiedProductsByID(galleryID);
  if (!products) {
    // products not found
    return {
      notFound: true,
    };
  }

  // redirect to correct path if screen name is invalid
  if (
    normalizeScreenName(screenName) !== galleryData.owner.screenNameNormalized
  ) {
    return {
      redirect: {
        destination: routes.galleryList(
          galleryData.owner.screenName,
          galleryData.id
        ),
        permanent: false,
      },
    };
  }

  return {
    props: {
      products,
      galleryName,
    },
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return parseUserAndGallery(params);
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default GalleiedProductsPage;
