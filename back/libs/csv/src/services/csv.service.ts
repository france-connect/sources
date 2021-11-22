import { Inject, Injectable, Type } from '@nestjs/common';

import { filteredByDto } from '@fc/common';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

import { CsvParsingException } from '../exceptions/csv-parsing.exception';
import { parseCsv } from '../helpers';
import { Csv, RepositoryInterface } from '../interfaces';
import { CSV_VALIDATOR } from '../tokens';

const VALIDATOR_OPTIONS = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
};

@Injectable()
export class CsvService<T> implements RepositoryInterface<T> {
  private collection: T[];

  constructor(
    private readonly logger: LoggerService,
    @Inject(CSV_VALIDATOR)
    private readonly validator: Type<T>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async pickData(rawRows: Csv[]): Promise<T[]> {
    this.logger.debug('pickData()');
    const validator = async (row: Csv, i) => {
      const { errors, result } = await filteredByDto(
        row,
        this.validator,
        VALIDATOR_OPTIONS,
      );
      if (errors.length) {
        const message = JSON.stringify(errors, null, 2);
        this.logger.warn(
          `"row n°${
            i + 1
          }" was excluded from the result at DTO validation :${message}`,
        );
        return null;
      }
      return result;
    };
    const extracted = await Promise.all(rawRows.map(validator));
    const data: T[] = extracted.filter(Boolean);
    return data;
  }

  private headersFilter() {
    const fn = (headers: string[]) => headers.map((h) => h.toLowerCase());
    return fn;
  }

  async parse(path: string): Promise<void> {
    try {
      this.logger.debug(`Loading collection...`);

      // transform Database keys to class keys
      const headers = this.headersFilter();

      const rawRows = await parseCsv(path, {
        headers,
        ignoreEmpty: true,
        trim: true,
      });

      const data = await this.pickData(rawRows);
      this.logger.trace({ data, path });
      this.collection = data;
    } catch (error) {
      this.logger.trace({ error, path }, LoggerLevelNames.ERROR);
      throw new CsvParsingException();
    }
  }

  async find(filters: { [key: string]: string }): Promise<T | null> {
    const criteria = Object.entries(filters);

    const result = this.collection.find((row) => {
      const search = ([key, value]) => key in row && row[key] == value;
      return criteria.every(search);
    });
    return (result as T) || null;
  }
}
