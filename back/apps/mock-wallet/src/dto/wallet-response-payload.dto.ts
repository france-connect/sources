import { IsObject, IsOptional, IsString } from 'class-validator';

import { DcqlVpToken, WalletResponsePayload } from '../interfaces';
import { IsVpToken } from '../validators';

export class WalletResponsePayloadDto implements WalletResponsePayload {
  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsVpToken()
  @IsObject()
  readonly vp_token: DcqlVpToken;
}
