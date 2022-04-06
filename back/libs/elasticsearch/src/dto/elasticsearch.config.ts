/* istanbul ignore file */
import { IsArray, IsString, IsUrl } from 'class-validator';

export class ElasticsearchConfig {
  @IsString()
  readonly tracksIndex: string;

  @IsArray()
  @IsUrl(
    {
      // Validator.js defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      protocols: ['https'],
      // Validator.js defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_tld: false,
      // Validator.js defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
