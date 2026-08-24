import { Command } from 'nest-commander';

import {
  derivePeriod,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ElasticTransformCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';
import { ElasticTransformBaseCommand } from './elastic-transform-base.command';

@Command({
  name: 'elastic-transform',
  description: 'Create and start the transform.',
})
export class ElasticTransformCommand extends ElasticTransformBaseCommand {
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
    this.logger.debug('--- Start ElasticTransformCommand ---');

    const product = options.product as ElasticControlProductEnum;
    const range = options.range as ElasticControlRangeEnum;
    const pivot = options.pivot as ElasticControlPivotEnum;
    const period = options?.period ?? derivePeriod(range);

    await this.transform.safeInitializeTransform(
      { product, range, pivot, period },
      Boolean(options.dryRun),
      Boolean(options.force),
    );

    this.logger.debug('--- End ElasticTransformCommand ---');
  }
}
