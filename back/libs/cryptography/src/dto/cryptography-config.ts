import { IsByteLength, IsString } from 'class-validator';

export class CryptographyConfig {
  @IsString()
  // 16 minimum entropy bites
  @IsByteLength(16)
  readonly passwordSalt: string;
}
