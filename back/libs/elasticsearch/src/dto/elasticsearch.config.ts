/* istanbul ignore file */
import { IsNumber, IsString } from 'class-validator';

export class ElasticsearchConfig {
  @IsString()
  readonly tracksIndex: string;

  @IsString()
  readonly protocol: string;

  @IsString()
  readonly host: string;

  @IsNumber()
  readonly port: number;
}
