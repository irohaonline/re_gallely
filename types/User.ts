type User = {
  id: string;
  displayName: string;
  screenName: string;
  screenNameNormalized: string;
  bio: string;
  photoURL: string | null;
  joinedAt: Date;
};

export default User;

export const isUser = (arg: any): arg is User => {
  return typeof arg.displayName !== 'undefined';
};

export type UserProfile = Omit<
  User,
  'id' | 'screenNameNormalized' | 'joinedAt'
>;
