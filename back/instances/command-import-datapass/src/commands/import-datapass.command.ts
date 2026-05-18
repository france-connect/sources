import { Command, CommandRunner, Option } from 'nest-commander';

import { DatapassEidasLevels } from '@fc/datapass';
import { LoggerService } from '@fc/logger';

import { ImportDatapassService } from '../services';

@Command({
  name: 'import-datapass',
  description:
    'Import validated DataPass authorizations into the partner space',
})
export class ImportDatapassCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly importService: ImportDatapassService,
  ) {
    super();
  }

  // We must to destructure options to have correct values
  // eslint-disable-next-line complexity
  async run(
    _passedParams: string[],
    options?: {
      id?: number;
      since?: Date;
      eidas?: DatapassEidasLevels[];
      dryRun?: boolean;
    },
  ): Promise<void> {
    const {
      id,
      since,
      eidas = [DatapassEidasLevels.EIDAS_1],
      dryRun = false,
    } = options ?? {};

    if (id !== undefined) {
      await this.runGetById(id);
    } else {
      await this.runGetAll(eidas, dryRun, since);
    }
  }

  private async runGetAll(
    eidasLevels: DatapassEidasLevels[],
    dryRun: boolean,
    since?: Date,
  ): Promise<void> {
    this.logger.info(
      since
        ? `--- Importing DataPass requests since ${since.toISOString()} ---`
        : '--- Importing DataPass requests ---',
    );

    try {
      const { total, success, failure } = await this.importService.importAll(
        eidasLevels,
        dryRun,
        since,
      );
      this.logger.info(`Found ${total} validated request(s)`);
      this.logger.info({
        message: 'DataPass import batch completed',
        success,
        failure,
      });
    } catch (error) {
      this.logger.err({
        message: 'Failed to import DataPass requests',
        error: (error as Error).message,
      });
    }

    this.logger.info('--- Done ---');
  }

  private async runGetById(id: number): Promise<void> {
    this.logger.info(`--- Importing DataPass request id=${id} ---`);

    try {
      await this.importService.importById(id);
    } catch (error) {
      this.logger.err({
        message: `Failed to import DataPass request id=${id}`,
        error: (error as Error).message,
      });
    }

    this.logger.info('--- Done ---');
  }

  @Option({
    flags: '--dry-run',
    description:
      'Preview the import without sending data to the webhook (logs request IDs and counts)',
  })
  parseDryRun(): boolean {
    return true;
  }

  @Option({
    flags: '--id <number>',
    description: 'Import a specific DataPass request by id',
  })
  parseId(rawId: string): number {
    return parseInt(rawId, 10);
  }

  @Option({
    flags: '--since <date>',
    description:
      'Filter requests validated after this date (ISO 8601, e.g. 2025-01-01)',
  })
  parseSince(rawDate: string): Date {
    return new Date(rawDate);
  }

  @Option({
    flags: '--eidas <levels...>',
    description:
      'Filter by eidas level(s): 1, 2, 3 (default: 1). Example: --eidas 1 2',
  })
  parseEidas(
    rawLevel: string,
    parsedLevels: DatapassEidasLevels[] = [],
  ): DatapassEidasLevels[] {
    return [...parsedLevels, `eidas_${rawLevel}` as DatapassEidasLevels];
  }
}
