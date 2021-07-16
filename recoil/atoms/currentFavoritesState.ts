import { atom } from 'recoil';
import Favorite from '../../types/Favorite';

// undefined: not loaded yet
// null: loading finished, but user is not logged in
const currentFavoriteState = atom<undefined | null | Favorite[]>({
  key: 'currentFavoriteState',
  default: undefined,
});

export default currentFavoriteState;
