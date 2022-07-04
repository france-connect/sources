/* istanbul ignore file */

// declarative file
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { IRichClaim } from '@fc/scopes';

import { TrackableEvent } from '../enums';
import { ICsmrTracksOutputTrack } from '../interfaces';

export class TrackDto implements ICsmrTracksOutputTrack {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumberString()
  time: number;

  @IsEnum(TrackableEvent)
  event: string;

  @IsString()
  idpName: string;

  @IsString()
  idpLabel: string;

  @IsString()
  spAcr: string;

  @IsString()
  spLabel: string;

  @IsString()
  trackId: string;

  @IsIn(['FranceConnect', 'FranceConnect+'])
  platform: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  claims: IRichClaim[];
}
