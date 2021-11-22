import { Injectable } from '@nestjs/common';

import { eidasCountryListData } from './data';
import { IEidasCountryElement } from './interfaces';

// For test purpose
export interface EidasCountryServiceInterface {
  getListByIso(availables: string[]): Promise<IEidasCountryElement[]>;
}
@Injectable()
export class EidasCountryService implements EidasCountryServiceInterface {
  /**
   * Get the displayable countries for Eidas
   * @param {string[]} availables list of Iso to select countries
   * @returns {IEidasCountryElement[]} list of countries displayable
   */
  async getListByIso(availables: string[]): Promise<IEidasCountryElement[]> {
    return eidasCountryListData.filter(({ iso }) => availables.includes(iso));
  }
}
