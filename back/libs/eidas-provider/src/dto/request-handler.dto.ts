import { IsBase64, IsString } from 'class-validator';

export class RequestHandlerDTO {
  @IsString()
  @IsBase64()
  readonly token: string;
}
