import { InseeDbCityCurrentInterface } from '.';

export interface InseeDbCityExtendedInterface extends Pick<
  InseeDbCityCurrentInterface,
  'TYPECOM' | 'COM' | 'DEP' | 'NCC' | 'LIBELLE' | 'COMPARENT'
> {
  LAST_COMPARENT: string;
}
