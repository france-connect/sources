import { Command } from 'nest-commander';

import {
  DEFAULT_TIMEZONE,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ElasticTransformCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';
import { getPreviousMonth } from '../utils';
import { ElasticTransformBaseCommand } from './elastic-transform-base.command';

@Command({
  name: 'elastic-transform-watcher',
  description: 'Update the transform state.',
})
export class ElasticTransformWatcherCommand extends ElasticTransformBaseCommand {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly transform: CommandElasticTransformService,
  ) {
    super(logger, transform);
  }

  async run(
    _passedParams: string[],
    options?: ElasticTransformCommandOptionsInterface,
  ): Promise<void> {
    this.logger.debug('--- Start ElasticTransformWatcherCommand ---');

    const product = options.product as ElasticControlProductEnum;
    const range = options.range as ElasticControlRangeEnum;
    const pivot = options.pivot as ElasticControlPivotEnum;
    const period = options?.period || getPreviousMonth();
    const timezone = DEFAULT_TIMEZONE;

    await this.transform.actualizeTransform(
      { period, product, range, pivot, timezone },
      Boolean(options.dryRun),
    );

    this.logger.debug('--- End ElasticTransformWatcherCommand ---');
  }
}
