import { Exclude, Expose } from 'class-transformer';
import { IsAscii, Length } from 'class-validator';

import { CityInterface } from '../interfaces';
import { IsCog } from '../validators';

@Exclude()
export class CityDto implements CityInterface {
  @IsCog()
  @Expose()
  com: string;

  @Length(1, 200)
  @IsAscii()
  @Expose()
  libelle: string;
}
