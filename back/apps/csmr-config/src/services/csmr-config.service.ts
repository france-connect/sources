import { Inject, Injectable } from '@nestjs/common';

import {
  ConfigDatabaseServiceInterface,
  ConfigSaveResultInterface,
} from '@fc/config-abstract-adapter';
import {
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client/dto';

import { CONFIG_DATABASE_SERVICE } from '../tokens';

@Injectable()
export class CsmrConfigService {
  constructor(
    @Inject(CONFIG_DATABASE_SERVICE)
    private readonly configDatabaseService: ConfigDatabaseServiceInterface,
  ) {}

  async create(
    config: ConfigCreateMessageDto,
  ): Promise<ConfigSaveResultInterface> {
    const result = await this.configDatabaseService.create(config);

    return result;
  }

  async update(
    config: ConfigUpdateMessageDto,
  ): Promise<ConfigSaveResultInterface> {
    const result = await this.configDatabaseService.update(config);

    return result;
  }

  async delete(
    config: ConfigDeleteMessageDto,
  ): Promise<ConfigSaveResultInterface> {
    const result = await this.configDatabaseService.delete(config);

    return result;
  }
}
