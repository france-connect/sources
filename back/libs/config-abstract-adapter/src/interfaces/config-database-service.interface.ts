import { ConfigMessageDto } from '@fc/csmr-config-client/protocol';

import { diffKeys } from '../types';

export interface ConfigSaveResultInterface {
  id: string;
  diff?: diffKeys;
}

export interface ConfigDatabaseServiceInterface {
  create(config: ConfigMessageDto): Promise<ConfigSaveResultInterface>;

  update(config: ConfigMessageDto): Promise<ConfigSaveResultInterface>;
}
