import { IsString } from 'class-validator';

export class ErrorParamsDto {
  @IsString()
  readonly error: string;

  @IsString()
  readonly error_description: string;
}
