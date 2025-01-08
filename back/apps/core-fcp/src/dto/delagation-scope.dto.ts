import { IsEnum } from 'class-validator';

import { DelegationScope } from '../enums';

export class DelegationScopeConfig {
  @IsEnum(DelegationScope, { each: true })
  delegationScope: string[];
}
