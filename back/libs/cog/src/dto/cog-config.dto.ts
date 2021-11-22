import { IsNotEmpty, IsString } from 'class-validator';

import {
  COG_CITY as cogCitySourcePath,
  COG_COUNTRY as cogCountrySourcePath,
} from '../tokens';

export class CogConfig {
  @IsNotEmpty()
  @IsString()
  [cogCitySourcePath]: string;

  @IsNotEmpty()
  @IsString()
  [cogCountrySourcePath]: string;
}
