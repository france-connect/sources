/* istanbul ignore file */

// Declarative code
import { IsString, IsUrl, MinLength } from 'class-validator';

export class EidasClientConfig {
  @IsString()
  @MinLength(1)
  readonly connectorRequestIssuer: string;

  @IsString()
  @MinLength(1)
  readonly connectorRequestCache: string;

  @IsString()
  @IsUrl()
  readonly connectorRequestCacheUrl: string;

  @IsString()
  @MinLength(1)
  readonly connectorResponseCache: string;

  @IsString()
  @IsUrl()
  readonly redirectAfterResponseHandlingUrl: string;
}
