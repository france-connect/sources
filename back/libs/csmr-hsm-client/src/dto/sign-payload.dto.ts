import { IsString } from 'class-validator';

import { SignatureDigest } from '../enums';

export class SignPayloadDto {
  @IsString()
  readonly data: string;

  @IsString()
  readonly digest: SignatureDigest;
}
