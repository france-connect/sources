import { Command, CommandRunner } from 'nest-commander';

import { LoggerService } from '@fc/logger';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';

import { CsvInputService, ImportService } from '../services';

@Command({
  name: 'import-sp-sandbox',
  description: 'Import Service Providers into Sandbox',
})
export class ImportSpSandboxCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly importService: ImportService,
    private readonly csvInputService: CsvInputService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
  ) {
    super();
  }

  async run(): Promise<void> {
    this.logger.info('# Begin import');
    try {
      await this.importService.diagnostic();

      // 1. load and validate CSV data
      const dsData = await this.csvInputService.loadCsv();

      // 2. load and validate MongoDB data
      const dbData = await this.serviceProvider.getList();

      // 3. Call main import process
      await this.importService.import(dsData, dbData);
    } catch (error) {
      this.logger.err({
        msg: error.message,
        reason: error,
        type: error.constructor.name,
      });
      throw error;
    }

    this.logger.info('# End import');
  }
}
