/* istanbul ignore file */

// Declarative code
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { BridgeResponse, ValidateHttpHeaders } from '@fc/rie';

export class BridgeResponseDto implements BridgeResponse {
  @IsNumber()
  readonly status: number;

  @IsString()
  @IsOptional()
  readonly message?: string;

  @IsObject()
  @ValidateHttpHeaders()
  readonly headers: Record<string, unknown>;

  /**
   * this parameter is voluntary abstract.
   * the proxy is not in charge to validate the exactness of the data itself
   */
  @IsDefined()
  @IsNotEmpty()
  readonly data: unknown;
}
