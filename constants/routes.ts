import Tag from '../types/Tag';

const routes = {
  home: '/',
  welcome: '/welcome',
  signIn: '/join',
  post: '/post',
  studio: '/studio',
  gallery: '/gallery',
  userProfile: (screenName: string): string => `/${screenName}`,
  favorites: (screenName: string): string =>
    `/${screenName}/favorites`,
  galleryList: (screenName: string, tagID: string): string =>
    `/${screenName}/gallery/${tagID}`,
  postGalleryID: (screenName: string, galleryID: string): string =>
    `/${screenName}/post/${galleryID}`,
  vote: (tag: Tag): string =>
    `${routes.galleryList(tag.owner.screenName, tag.id)}/vote`,
  accountSettings: '/settings',
};

export default routes;
