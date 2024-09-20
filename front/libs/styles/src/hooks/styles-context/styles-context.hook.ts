import { useSafeContext } from '@fc/common';

import { StylesContext } from '../../context';
import type { StylesInterface } from '../../interfaces';

export const useStylesContext = () => {
  const values = useSafeContext<StylesInterface>(StylesContext);
  return values;
};
