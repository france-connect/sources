import { IsAscii, IsOptional, MinLength } from 'class-validator';

export class CryptographyEidasConfig {
  @IsAscii()
  @MinLength(8)
  @IsOptional()
  readonly subSecretKey: string;
}
