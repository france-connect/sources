import { Injectable } from '@nestjs/common';

import { eidasCountryListData } from './data';
import { IEidasCountryElement } from './interfaces';

@Injectable()
export class EidasCountryService {
  /**
   * Get the displayable countries for Eidas
   * @param {string[]} availables list of Iso to select countries
   * @returns {IEidasCountryElement[]} list of countries displayable
   */
  getListByIso(availables: string[]): IEidasCountryElement[] {
    return eidasCountryListData.filter(({ iso }) => availables.includes(iso));
  }
}
