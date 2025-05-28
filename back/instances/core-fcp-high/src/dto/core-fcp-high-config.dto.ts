import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CoreFcpConfig } from '@fc/core-fcp';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';

export class CoreFcpHighConfig extends CoreFcpConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => MicroservicesRmqConfig)
  readonly CsmrHsmClientMicroService: MicroservicesRmqConfig;
}
