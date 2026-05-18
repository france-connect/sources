import { IsNotEmpty, IsString } from 'class-validator';

export class PostWebhookBodyDto {
  @IsString()
  @IsNotEmpty()
  payload: string;
}
