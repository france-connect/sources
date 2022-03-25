/* istanbul ignore file */

// declarative file
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

import { TrackableEvent } from '../enums';
import { ICsmrTracksOutputTrack } from '../interfaces';

export class TrackDto implements ICsmrTracksOutputTrack {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsDateString()
  date: string;

  @IsEnum(TrackableEvent)
  event: string;

  @IsString()
  spAcr: string;

  @IsString()
  spName: string;

  @IsString()
  trackId: string;

  @IsIn(['FranceConnect', 'FranceConnect+'])
  platform: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  claims: string[] | null;
}
