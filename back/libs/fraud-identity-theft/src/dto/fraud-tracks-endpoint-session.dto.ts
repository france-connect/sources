import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { FraudConnectionSessionDto } from './fraud-connection-session.dto';

export class FraudTracksEndpointSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FraudConnectionSessionDto)
  connection: FraudConnectionSessionDto;
}
