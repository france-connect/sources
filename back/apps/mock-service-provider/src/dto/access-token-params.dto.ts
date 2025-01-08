import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenParamsDTO {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
