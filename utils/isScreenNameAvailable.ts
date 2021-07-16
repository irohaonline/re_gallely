import getUserByScreenName from '../api/UserAPI/getUserByScreenName';
import normalizeScreenName from './normalizeScreenName';

const isScreenNameAvailable = async (
  screenName: string,
  currentUserScreenName: string
): Promise<boolean> => {
  // taken check
  let existingUser;
  try {
    existingUser = await getUserByScreenName(screenName);
  } catch (e) {
    // failed to fetch user data
    return false;
  }

  if (
    existingUser &&
    existingUser.screenNameNormalized !==
      normalizeScreenName(currentUserScreenName)
  ) {
    // screen name is taken by someone
    return false;
  }

  // screen name available
  return true;
};

export default isScreenNameAvailable;
