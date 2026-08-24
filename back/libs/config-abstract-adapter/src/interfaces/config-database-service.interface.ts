import {
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client/protocol';

import { diffKeys } from '../types';

export interface ConfigSaveResultInterface {
  id: string;
  diff?: diffKeys;
}

export interface ConfigDatabaseServiceInterface {
  create(config: ConfigCreateMessageDto): Promise<ConfigSaveResultInterface>;

  update(config: ConfigUpdateMessageDto): Promise<ConfigSaveResultInterface>;

  delete(config: ConfigDeleteMessageDto): Promise<ConfigSaveResultInterface>;
}
