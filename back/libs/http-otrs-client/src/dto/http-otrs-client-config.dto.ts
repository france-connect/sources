import { IsString, IsUrl } from 'class-validator';

export class HttpOtrsClientConfigDto {
  @IsUrl({ protocols: ['https'], require_protocol: true })
  readonly baseUrl: string;

  @IsString()
  readonly userLogin: string;

  @IsString()
  readonly password: string;
}
