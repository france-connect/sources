import { IsString } from 'class-validator';

export class ElasticControlConfig {
  @IsString()
  readonly metricsIndex: string;

  @IsString()
  readonly controlIndex: string;

  @IsString()
  readonly lowTracksIndex: string;

  @IsString()
  readonly highTracksIndex: string;
}
