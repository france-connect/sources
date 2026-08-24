import { IsNotEmpty, IsString } from 'class-validator';

import {
  COG_CITY as cogCitySourcePath,
  COG_COUNTRY as cogCountrySourcePath,
  COG_ISO_COUNTRY as cogIsoCountrySourcePath,
} from '../tokens';

export class CogConfig {
  @IsNotEmpty()
  @IsString()
  [cogCitySourcePath]: string;

  @IsNotEmpty()
  @IsString()
  [cogCountrySourcePath]: string;

  @IsNotEmpty()
  @IsString()
  [cogIsoCountrySourcePath]: string;
}
