import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CsmrConfigConfig } from '@fc/csmr-config';
import { PostgresConfig } from '@fc/postgres';

export class CsmrConfigSandboxLowConfig extends CsmrConfigConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => PostgresConfig)
  readonly Postgres: PostgresConfig;
}
