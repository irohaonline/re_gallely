import Product from './Product';

type Images = {
  id: string;
  path: string;
};

type Favorite = {
  id: string;
  addedAt: Date;
  product: Product;
};

export default Favorite;
