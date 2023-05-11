import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { CityInterface } from '../interfaces';
import { IsCog } from '../validators';

/**
 * Columns name comes from INSEE provided file so we have to keep them as is
 */
@Exclude()
export class CityDto implements CityInterface {
  @IsCog()
  @Expose()
  com: string;

  @Length(1, 200)
  @IsString()
  @Expose()
  libelle: string;
}
