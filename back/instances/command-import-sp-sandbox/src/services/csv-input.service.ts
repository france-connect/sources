import { Injectable } from '@nestjs/common';

import { ArrayAsyncHelper, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { parseCsv } from '@fc/csv';
import { LoggerService } from '@fc/logger';

import { AppCliConfig, ImportDsCsvDto } from '../dto';
import { CsvInputInterface } from '../interfaces';

@Injectable()
export class CsvInputService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  async loadCsv(): Promise<CsvInputInterface[]> {
    const { dsCsvPath } = this.config.get<AppCliConfig>('App');

    const dsRawData = await parseCsv(dsCsvPath, {
      headers: ['email', 'datapassId'],
      renameHeaders: true,
      ignoreEmpty: true,
    });

    const dsData = await ArrayAsyncHelper.filterAsync<CsvInputInterface>(
      dsRawData,
      this.filterOutInvalidLines.bind(this),
    );

    return dsData;
  }

  private async filterOutInvalidLines(
    line: CsvInputInterface,
  ): Promise<boolean> {
    const errors = await validateDto(line, ImportDsCsvDto, {});

    if (errors.length) {
      this.logger.warning({
        msg: 'Invalid CSV line',
        line,
        errors,
      });

      return false;
    }

    return true;
  }
}
