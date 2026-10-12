import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DatapassConfig {
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly apiUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly clientId: string;

  @IsString()
  @IsNotEmpty()
  readonly clientSecret: string;
}
