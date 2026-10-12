import { Expose, Transform } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { parseJsonAs } from '@fc/common';

import { SubmitErrorBodyDto } from './submit-error-body.dto';
import { WalletResponsePayloadDto } from './wallet-response-payload.dto';

export class SubmitBodyDto extends SubmitErrorBodyDto {
  @Transform(parseJsonAs(WalletResponsePayloadDto))
  @ValidateNested()
  @IsObject()
  @Expose()
  readonly responsePayload: WalletResponsePayloadDto;
}
