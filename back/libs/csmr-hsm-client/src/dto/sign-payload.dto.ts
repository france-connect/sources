import { IsString } from 'class-validator';

import { SignatureDigest } from '@fc/cryptography';

export class SignPayloadDto {
  @IsString()
  readonly data: string;

  @IsString()
  readonly digest: SignatureDigest;
}
