import { IsString } from 'class-validator';

export class GeoipMaxmindConfig {
  @IsString()
  path: string;
}
