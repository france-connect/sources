import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class ApiErrorDto {
  @IsString()
  @MinLength(1)
  readonly error: string;

  @IsString()
  @MinLength(1)
  readonly error_description: string;

  @IsUrl()
  @IsOptional()
  readonly error_uri: string;
}
