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
