/* istanbul ignore file */

// Declarative code
import { IsNumber, IsObject, IsString } from 'class-validator';

import { BridgeResponse, ValidateHttpHeaders } from '@fc/hybridge-http-proxy';

export class BridgeHttpProxyResponseDto implements BridgeResponse {
  @IsNumber()
  readonly status: number;

  @IsString()
  readonly statusText: string;

  @IsObject()
  @ValidateHttpHeaders()
  readonly headers: Record<string, unknown>;

  /**
   * this parameter is voluntary abstract.
   * the proxy is not in charge to validate the exactness of the data itself
   */
  @IsString()
  readonly data: string;
}
