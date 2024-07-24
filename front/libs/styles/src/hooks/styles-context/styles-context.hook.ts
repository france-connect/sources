import { useContext } from 'react';

import { StylesContext } from '../../context';
import { NotWrappedIntoProviderException } from '../../exceptions';

export const useStylesContext = () => {
  const values = useContext(StylesContext);

  if (!values) {
    throw new NotWrappedIntoProviderException();
  }

  return values;
};
