import { IsString } from 'class-validator';

export class ErrorParamsDto {
  @IsString()
  readonly error: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly error_description: string;
}
