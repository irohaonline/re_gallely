import User from './User';

type Product = {
  id: string;
  name: string;
  caption: string;
  galleryID: string;
  url: string;
  tagID: string;
  ownerID: string;
  createdAt: Date;
  hosting: string | null | undefined;
};

export default Product;
