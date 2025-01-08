import { IsAscii, IsOptional, MinLength } from 'class-validator';

export class CryptographyFcpConfig {
  @IsAscii()
  @MinLength(8)
  @IsOptional()
  readonly subSecretKey: string;
}
