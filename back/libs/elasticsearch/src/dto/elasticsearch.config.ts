import { IsArray, IsString, IsUrl } from 'class-validator';

export class ElasticsearchConfig {
  @IsString()
  readonly index: string;

  @IsArray()
  @IsUrl(
    {
      require_protocol: true,
      protocols: ['https'],
      require_tld: false,
      require_port: true,
    },
    {
      each: true,
    },
  )
  readonly nodes: string[];

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
