/* istanbul ignore file */

// Declarative code
import { IsNumber, IsString } from 'class-validator';

import { BridgeError } from '@fc/hybridge-http-proxy';

export class BridgeHttpProxyErrorDto implements BridgeError {
  @IsNumber()
  readonly code: number;

  @IsString()
  readonly reason: string;

  @IsString()
  readonly name: string;
}
