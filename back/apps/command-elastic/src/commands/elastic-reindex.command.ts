import { Command, CommandRunner, Option } from 'nest-commander';

import {
  DEFAULT_TIMEZONE,
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ElasticReindexCommandOptionsInterface } from '../interfaces';
import { CommandElasticReindexService } from '../services';
import { getPreviousMonth } from '../utils';

@Command({
  name: 'elastic-reindex',
  description: 'Reindex the transform results in the metrics index.',
})
export class ElasticReindexCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly reindex: CommandElasticReindexService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ElasticReindexCommandOptionsInterface,
  ): Promise<void> {
    this.logger.info('--- Start ElasticReindexCommand ---');

    const key = options.key as ElasticControlKeyEnum;
    const product = options.product as ElasticControlProductEnum;
    const range = options.range as ElasticControlRangeEnum;
    const pivot = options.pivot as ElasticControlPivotEnum;
    const period = options?.period ?? getPreviousMonth();
    const timezone = DEFAULT_TIMEZONE;

    await this.reindex.safeInitializeReindex(
      { key, period, product, range, pivot, timezone },
      !!options.dryRun,
      !!options.force,
    );

    this.logger.info('--- End ElasticReindexCommand ---');
  }

  @Option({
    flags: '--key <key>',
    description:
      'Product (required). One of: ' +
      Object.keys(ElasticControlKeyEnum).join(', '),
  })
  parseKey(val: string): string {
    return val;
  }

  @Option({
    flags: '--product <product>',
    description:
      'Product (required). One of: ' +
      Object.keys(ElasticControlProductEnum).join(', '),
  })
  parseProduct(val: string): string {
    return val;
  }

  @Option({
    flags: '--range <range>',
    description:
      'Range (required). One of: ' +
      Object.keys(ElasticControlRangeEnum).join(', '),
  })
  parseRange(val: string): string {
    return val;
  }

  @Option({
    flags: '--pivot <pivot>',
    description:
      'Pivot (required). One of: ' +
      Object.keys(ElasticControlPivotEnum).join(', '),
  })
  parsePivot(val: string): string {
    return val;
  }

  @Option({
    flags: '--period <period>',
    description:
      'Period (optional). If omitted, defaults to the previous month. Example: 2025-08',
  })
  parsePeriod(val: string): string {
    return val;
  }

  @Option({
    flags: '-d, --dry-run',
    description:
      "Don't perform any write operation; just print intended actions.",
  })
  parseDryRun(): boolean {
    return true;
  }

  @Option({
    flags: '-f, --force',
    description: 'Force recreation if needed.',
  })
  parseForce(): boolean {
    return true;
  }
}
