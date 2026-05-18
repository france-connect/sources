import { IsString, IsUrl } from 'class-validator';

export class HttpOtrsClientConfigDto {
  // Validator.js defined property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @IsUrl({ protocols: ['https'], require_protocol: true })
  readonly baseUrl: string;

  @IsString()
  readonly userLogin: string;

  @IsString()
  readonly password: string;
}
