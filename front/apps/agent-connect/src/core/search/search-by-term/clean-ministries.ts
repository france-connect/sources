import omit from 'lodash.omit';

import { Ministry } from '../../../types';

export const cleanMinistries = (ministries: Ministry[]): Partial<Ministry>[] => {
  const cleaned = ministries.map((ministry) => omit(ministry, ['slug']));
  return cleaned;
};
