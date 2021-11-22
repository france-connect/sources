import { IsString, MinLength } from 'class-validator';

export class ApacheIgniteConfig {
  @IsString()
  @MinLength(1)
  endpoint: string;
}
