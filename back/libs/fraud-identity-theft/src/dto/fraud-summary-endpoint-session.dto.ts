import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { FraudConnectionSessionDto } from './fraud-connection-session.dto';
import { FraudContactSessionDto } from './fraud-contact-session.dto';
import { FraudDescriptionSessionDto } from './fraud-description-session.dto';
import { FraudIdentitySessionDto } from './fraud-identity-session.dto';

export class FraudSummaryEndpointSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FraudDescriptionSessionDto)
  description: FraudDescriptionSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudConnectionSessionDto)
  connection: FraudConnectionSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudIdentitySessionDto)
  identity: FraudIdentitySessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudContactSessionDto)
  contact: FraudContactSessionDto;
}
