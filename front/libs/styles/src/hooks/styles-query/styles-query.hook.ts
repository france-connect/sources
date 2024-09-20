import { useMediaQuery } from 'usehooks-ts';

import { objectToMediaQuery } from '../../helpers';
import type { MediaQueryInterface } from '../../interfaces';

export const useStylesQuery = (query: MediaQueryInterface) => {
  const mediaQuery = objectToMediaQuery(query);
  const matches = useMediaQuery(mediaQuery);
  return matches;
};
