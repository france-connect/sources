import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';

import { IsoCogCountryInterface } from '../interfaces';
import { IsCog } from '../validators';

@Exclude()
export class IsoCogCountryDto implements IsoCogCountryInterface {
  /**
   * @note IsISO31661Alpha2 is not used because class-validator does not support user assigned codes
   */
  @Matches(/^[A-Z]{2}$/)
  @Expose()
  iso: string;

  @Expose()
  @IsCog()
  cog: string;
}
