/* istanbul ignore file */

// Declarative code
import { IsString, IsUrl, MinLength } from 'class-validator';

export class EidasProviderConfig {
  @IsString()
  @MinLength(1)
  readonly proxyServiceRequestCache: string;

  @IsString()
  @MinLength(1)
  readonly proxyServiceResponseIssuer: string;

  @IsString()
  @MinLength(1)
  readonly proxyServiceResponseCache: string;

  @IsString()
  @IsUrl()
  readonly proxyServiceResponseCacheUrl: string;

  @IsString()
  @IsUrl()
  readonly redirectAfterRequestHandlingUrl: string;
}
