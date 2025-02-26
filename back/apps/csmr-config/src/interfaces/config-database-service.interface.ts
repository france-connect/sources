import { ConfigMessageDto } from '@fc/csmr-config-client/dto';

export interface ConfigDatabaseServiceInterface {
  create(config: ConfigMessageDto): Promise<string>;

  update(config: ConfigMessageDto): Promise<string>;
}
