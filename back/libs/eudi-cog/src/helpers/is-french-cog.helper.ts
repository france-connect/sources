import { FRANCE_COG_LIST } from '../constants';

export function isFrenchCog(countryCog: string): boolean {
  return FRANCE_COG_LIST.includes(countryCog);
}
