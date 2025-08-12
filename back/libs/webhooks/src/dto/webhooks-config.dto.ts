import { IsString, MinLength } from 'class-validator';

export class WebhooksConfig {
  @IsString()
  @MinLength(32)
  readonly secret: string;
}
