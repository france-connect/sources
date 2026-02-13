import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { ElasticControlInvalidRequestException } from '../exceptions';
import { isNotFound } from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';

@Injectable()
export class ElasticControlDestIndexService {
  constructor(
    private readonly logger: LoggerService,
    private readonly elastic: ElasticControlClientService,
  ) {}

  async safeDeleteDestIndex(index: string, dryRun: boolean): Promise<void> {
    if (dryRun) {
      this.logger.debug(`[dest index] dry-run: would delete index "${index}"`);
      return;
    }

    try {
      await this.elastic.deleteIndex(index);

      this.logger.debug(`[dest index] Deleted dest index "${index}"`);
    } catch (error) {
      if (isNotFound(error)) {
        this.logger.debug(
          `[dest index] Delete ignored: index "${index}" not found (404)`,
        );
        return;
      }
      throw new ElasticControlInvalidRequestException(error);
    }
  }
}
