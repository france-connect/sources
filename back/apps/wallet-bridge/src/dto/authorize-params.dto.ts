import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

import { Split } from '@fc/common';
import { IsValidPrompt } from '@fc/oidc-provider';

/**
 * Control parameters on the authentication request.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */
export class AuthorizeParamsDto {
  @IsString()
  readonly client_id: string;

  @Split(/[ ]+/, { maxLength: 64 })
  @IsArray()
  @IsString({ each: true })
  readonly acr_values: string[];

  @IsOptional()
  @IsString()
  readonly claims?: string;

  @IsString()
  readonly response_type: string;

  @IsString()
  @MinLength(22)
  readonly nonce: string;

  @IsString()
  readonly state: string;

  @IsUrl({
    protocols: ['https'],
    // Validator.js defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
  })
  readonly redirect_uri: string;

  @IsString()
  readonly scope: string;

  @IsOptional()
  @Split(/[ ]+/, { maxLength: 64 })
  @IsString({ each: true })
  @IsValidPrompt()
  readonly prompt?: string[];
}
