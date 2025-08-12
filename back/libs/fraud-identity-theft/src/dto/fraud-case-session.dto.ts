import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { FraudConnectionSessionDto } from './fraud-connection-session.dto';
import { FraudContactSessionDto } from './fraud-contact-session.dto';
import { FraudDescriptionSessionDto } from './fraud-description-session.dto';
import { FraudIdentitySessionDto } from './fraud-identity-session.dto';

export class FraudCaseSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FraudDescriptionSessionDto)
  @IsOptional()
  description?: FraudDescriptionSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudConnectionSessionDto)
  @IsOptional()
  connection?: FraudConnectionSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudIdentitySessionDto)
  @IsOptional()
  identity?: FraudIdentitySessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudContactSessionDto)
  @IsOptional()
  contact?: FraudContactSessionDto;
}
