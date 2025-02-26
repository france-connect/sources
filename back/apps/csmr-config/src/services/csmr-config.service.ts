import { Inject, Injectable } from '@nestjs/common';

import { ConfigMessageDto } from '@fc/csmr-config-client/dto';

import { ConfigDatabaseServiceInterface } from '../interfaces';
import { CONFIG_DATABASE_SERVICE } from '../tokens';

@Injectable()
export class CsmrConfigService {
  constructor(
    @Inject(CONFIG_DATABASE_SERVICE)
    private readonly configDatabaseService: ConfigDatabaseServiceInterface,
  ) {}

  async create(config: ConfigMessageDto): Promise<string> {
    const id = await this.configDatabaseService.create(config);

    return id;
  }

  async update(config: ConfigMessageDto): Promise<string> {
    const id = await this.configDatabaseService.update(config);

    return id;
  }
}
