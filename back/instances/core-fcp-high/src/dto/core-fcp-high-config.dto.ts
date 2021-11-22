import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CoreFcpConfig } from '@fc/core-fcp';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CoreFcpHighConfig extends CoreFcpConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly CryptographyBroker: RabbitmqConfig;
}
