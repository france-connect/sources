import { IsBase64, IsString } from 'class-validator';

export class ReponseHandlerDTO {
  @IsString()
  @IsBase64()
  readonly token: string;
}
