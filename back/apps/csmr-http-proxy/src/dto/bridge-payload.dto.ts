/* istanbul ignore file */

// Declarative code
import { Transform } from 'class-transformer';
import { IsIn, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

import { BridgePayload, ValidateHttpHeaders } from '@fc/hybridge-http-proxy';

export class BridgePayloadDto implements BridgePayload {
  @IsUrl()
  readonly url: string;

  @IsIn(['get', 'post'])
  @Transform(({ value }) => value.toLowerCase())
  readonly method: string;

  @IsObject()
  @ValidateHttpHeaders()
  readonly headers: Record<string, string>;

  /**
   * this parameter is voluntary abstract.
   * the proxy is not in charge to validate the exactness of the data itself
   */
  @IsString()
  @IsOptional()
  readonly data?: string;
}
