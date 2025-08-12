import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

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
}
