import { useMediaQuery } from 'usehooks-ts';

import { objectToMediaQuery } from '../../helpers';
import type { MediaQuery } from '../../interfaces';

export const useStylesQuery = (query: MediaQuery) => {
  const mediaQuery = objectToMediaQuery(query);
  const matches = useMediaQuery(mediaQuery);
  return matches;
};
