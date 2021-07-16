import * as yup from 'yup';
import reservedScreenNames from '../constants/reservedScreenNames';
import prohibitedWords from '../constants/prohibitedWords';
import isScreenNameAvailable from '../utils/isScreenNameAvailable';
import normalizeScreenName from '../utils/normalizeScreenName';

export const screenNameValidation = yup
  .string()
  .trim()
  .required()
  .min(4)
  .max(20)
  .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/i)
  .test({
    name: 'reserved_screen_name',
    test: (value: string) => {
      return !reservedScreenNames.includes(normalizeScreenName(value));
    },
    message: 'this screen name is reserved by system',
  })
  .test({
    name: 'contains_prohibited_words',
    test: (value: string) => {
      return !prohibitedWords.some((prohibitedWord) =>
        normalizeScreenName(value).includes(prohibitedWord)
      );
    },
    message: 'this screen name contains prohibited word(s)',
  })
  .test({
    name: 'availability check',
    test: async (value: string, context) => {
      return await isScreenNameAvailable(
        value,
        context.options.context.currentScreenName || ''
      );
    },
    message: 'this screen name is unavailable',
  });

export const displayNameValidation = yup
  .string()
  .trim()
  .required()
  .min(1)
  .max(30);

export const bioValidation = yup.string().trim().max(400);

export const tagNameValidation = yup.string().trim().required().max(30);
