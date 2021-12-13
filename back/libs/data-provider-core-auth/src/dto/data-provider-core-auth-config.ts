/* istanbul ignore file */

// declarative file
import { IsString, IsUrl } from 'class-validator';

export class DataProviderCoreAuthConfig {
  @IsUrl()
  tokenEndpoint: string;

  @IsString()
  scope: string;
}
