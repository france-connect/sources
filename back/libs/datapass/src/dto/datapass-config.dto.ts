import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DatapassConfig {
  // Validator.js defined property
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
