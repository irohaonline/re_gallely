import { screenNameValidation } from '../validations';
import getUserByScreenName from '../api/UserAPI/getUserByScreenName';

const checkScreenNameAvailability = async (
  rawScreenName: string
): Promise<string> => {
  // run validation
  const screenName = await screenNameValidation
    .validate(rawScreenName)
    .catch((e) => {
      throw new Error(e.errors[0]);
    });

  if (typeof screenName !== 'string') {
    throw new Error('validation failed');
  }

  // taken check
  const existingUser = await getUserByScreenName(screenName);
  if (existingUser) {
    throw new Error('taken');
  }

  // return trimmed screen name
  return screenName;
};

export default checkScreenNameAvailability;
