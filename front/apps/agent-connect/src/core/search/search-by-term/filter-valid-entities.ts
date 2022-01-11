import { Ministry } from '../../../types';

export const filterValidEntities = (results: Ministry[]): Ministry[] => {
  const filtered = results.filter((item) => item.name).filter((item: Partial<Ministry>) => item.id);
  return filtered;
};
