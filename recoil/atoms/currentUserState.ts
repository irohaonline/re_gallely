import { atom } from 'recoil';
import User from '../../types/User';

// undefined: not loaded yet
// null: loading finished, but user is not logged in
const currentUserState = atom<undefined | null | User>({
  key: 'currentUserState',
  default: undefined,
});

export default currentUserState;
