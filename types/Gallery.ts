import Product from './Product';
import User from './User';

type Gallery = {
  id: string;
  createdAt: Date;
  name: string;
  products: Product[];
  owner: User;
};

export default Gallery;
