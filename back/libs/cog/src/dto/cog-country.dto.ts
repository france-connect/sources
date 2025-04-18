import { Exclude, Expose } from 'class-transformer';
import { IsAlpha, Length } from 'class-validator';

import { CountryInterface } from '../interfaces';
import { IsCog } from '../validators';

@Exclude()
export class CountryDto implements CountryInterface {
  @IsCog()
  @Expose()
  cog: string;

  @Length(1, 70)
  @Expose()
  libcog: string;

  @Length(2)
  @IsAlpha()
  @Expose()
  codeiso2: string;
}
