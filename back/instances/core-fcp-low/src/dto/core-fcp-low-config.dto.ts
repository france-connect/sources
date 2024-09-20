/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CoreFcpConfig, DelegationScopeConfig } from '@fc/core-fcp';

export class CoreFcpLowConfig extends CoreFcpConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => DelegationScopeConfig)
  readonly DelegationScope: DelegationScopeConfig;
}
