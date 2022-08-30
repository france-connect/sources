// Stryker disable all
/* istanbul ignore file */

// declarative file
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IProvider, IRichClaim } from '@fc/scopes';

import { TrackableEvent } from '../enums';
import { ICsmrTracksOutputTrack } from '../interfaces';

export class Provider implements IProvider {
  @IsString()
  key: string;

  @IsString()
  label: string;
}
export class RichClaim implements IRichClaim {
  @IsString()
  identifier: string;

  @IsString()
  label: string;

  @ValidateNested()
  @Type(() => Provider)
  provider: Provider;
}

export class TrackDto implements ICsmrTracksOutputTrack {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  time: number;

  @IsEnum(TrackableEvent)
  event: string;

  @IsString()
  @IsOptional()
  idpLabel?: string;

  @IsString()
  spAcr: string;

  @IsString()
  spLabel: string;

  @IsString()
  @Type(() => String)
  trackId: string;

  @IsIn(['FranceConnect', 'FranceConnect+'])
  platform: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RichClaim)
  claims: RichClaim[];
}
