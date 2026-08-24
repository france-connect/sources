import { CommandRunner, Option } from 'nest-commander';

import {
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ElasticTransformCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';

export abstract class ElasticTransformBaseCommand extends CommandRunner {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly transform: CommandElasticTransformService,
  ) {
    super();
  }

  abstract run(
    passedParams: string[],
    options?: ElasticTransformCommandOptionsInterface,
  ): Promise<void>;

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
      'Period (optional). Format depends on --range: YYYY-MM for MONTH, YYYY for YEAR, YYYY-01 or YYYY-07 for SEMESTER. ' +
      'If omitted, defaults to the previous period for the selected range.',
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
