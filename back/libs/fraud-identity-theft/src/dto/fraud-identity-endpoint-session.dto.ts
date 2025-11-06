import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';

import { FraudTrackDto } from '@fc/csmr-fraud-client';

import { FraudConnectionSessionDto } from './fraud-connection-session.dto';
import { FraudDescriptionSessionDto } from './fraud-description-session.dto';

export class FraudIdentityEndpointSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FraudDescriptionSessionDto)
  description: FraudDescriptionSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudConnectionSessionDto)
  connection: FraudConnectionSessionDto;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => FraudTrackDto)
  fraudTracks: FraudTrackDto[];
}
