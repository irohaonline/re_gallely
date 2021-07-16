import Product from './Product';
import User from './User';

type Tag = {
  id: string;
  name: string;
  owner: User;
  createdAt: Date;
  products: Product[];
};

export default Tag;
