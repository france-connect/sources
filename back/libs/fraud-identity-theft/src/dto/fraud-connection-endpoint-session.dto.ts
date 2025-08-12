import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { FraudDescriptionSessionDto } from './fraud-description-session.dto';

export class FraudConnectionEndpointSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FraudDescriptionSessionDto)
  description: FraudDescriptionSessionDto;
}
