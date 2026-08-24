import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsObject, IsUrl, ValidateNested } from 'class-validator';

import { parseJsonAs } from '@fc/common';

import { Flows } from '../enums';
import { RequestObjectPayloadDto } from './request-object-payload.dto';
import { WalletResponsePayloadDto } from './wallet-response-payload.dto';

export class SubmitBodyDto {
  @IsUrl({
    // Class-validator rule name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_tld: false,
    // Class-validator rule name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
    protocols: ['https', 'http'],
  })
  readonly responseUri: string;

  @Transform(parseJsonAs(RequestObjectPayloadDto))
  @ValidateNested()
  @IsObject()
  @Expose()
  readonly requestPayload: RequestObjectPayloadDto;

  @Transform(parseJsonAs(WalletResponsePayloadDto))
  @ValidateNested()
  @IsObject()
  @Expose()
  readonly responsePayload: WalletResponsePayloadDto;

  @IsEnum(Flows)
  readonly flow: Flows;
}
