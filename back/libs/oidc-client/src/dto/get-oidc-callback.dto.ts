import { IsAscii, IsString } from 'class-validator';

export class GetOidcCallback {
  @IsString()
  @IsAscii()
  readonly providerUid: string;
}
