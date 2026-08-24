import { Command, CommandRunner, Option } from 'nest-commander';

import { LoggerService } from '@fc/logger';

import { ElasticWatcherCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';

@Command({
  name: 'elastic-transform-watcher',
  description:
    'Actualize all running transforms. Exits with code 0 if all are done, 1 otherwise.',
})
export class ElasticTransformWatcherCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly transform: CommandElasticTransformService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ElasticWatcherCommandOptionsInterface,
  ): Promise<void> {
    this.logger.debug('--- Start ElasticTransformWatcherCommand ---');

    const dryRun = Boolean(options?.dryRun);

    const allCompleted = await this.transform.actualizeAllTransforms(dryRun);

    if (!allCompleted) {
      this.logger.debug(
        '[Command] Some transform operations are still pending or running',
      );
      process.exitCode = 1;
      return;
    }

    this.logger.debug(
      '[Command] All transform operations are in a final state',
    );

    this.logger.debug('--- End ElasticTransformWatcherCommand ---');
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
