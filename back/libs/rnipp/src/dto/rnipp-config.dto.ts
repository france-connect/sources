import { IsIn, IsNumber, IsString } from 'class-validator';

export class RnippConfig {
  @IsString()
  @IsIn(['http', 'https'])
  readonly protocol: string;

  @IsString()
  readonly hostname: string;

  @IsString()
  readonly baseUrl: string;

  @IsNumber()
  readonly timeout: number;
}
