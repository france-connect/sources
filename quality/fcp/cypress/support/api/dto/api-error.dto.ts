import { IsString, MinLength } from 'class-validator';

export class ApiErrorDto {
  @IsString()
  @MinLength(1)
  readonly error: string;

  @IsString()
  @MinLength(1)
  readonly error_description: string;
}
