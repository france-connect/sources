import { Command, CommandRunner, Option } from 'nest-commander';

import { LoggerService } from '@fc/logger';

import { ElasticWatcherCommandOptionsInterface } from '../interfaces';
import { CommandElasticReindexService } from '../services';

@Command({
  name: 'elastic-reindex-watcher',
  description:
    'Actualize all running reindexes. Exits with code 0 if all are done, 1 otherwise.',
})
export class ElasticReindexWatcherCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly reindex: CommandElasticReindexService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ElasticWatcherCommandOptionsInterface,
  ): Promise<void> {
    this.logger.info('--- Start ElasticReindexWatcherCommand ---');

    const dryRun = Boolean(options?.dryRun);

    const allCompleted = await this.reindex.actualizeAllReindexes(dryRun);

    if (!allCompleted) {
      this.logger.info(
        '[Command] Some reindex operations are still pending or running',
      );
      process.exitCode = 1;
      return;
    }

    this.logger.info('[Command] All reindex operations are in a final state');

    this.logger.info('--- End ElasticReindexWatcherCommand ---');
  }

  @Option({
    flags: '-d, --dry-run',
    description:
      "Don't perform any write operation; just print intended actions.",
  })
  parseDryRun(): boolean {
    return true;
  }
}
