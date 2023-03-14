/* istanbul ignore file */

// declarative file
import { IsString, IsUrl } from 'class-validator';

import { IClaim } from '@fc/scopes';

export class DataProviderCoreAuthConfig {
  @IsUrl()
  tokenEndpoint: string;

  @IsString()
  scope: IClaim;
}
