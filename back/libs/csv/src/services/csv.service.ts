import { Inject, Injectable, Type } from '@nestjs/common';

import { filteredByDto } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { CsvParsingException } from '../exceptions';
import { parseCsv } from '../helpers';
import { Csv, RepositoryInterface } from '../interfaces';
import { CSV_VALIDATOR } from '../tokens';

const VALIDATOR_OPTIONS = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
};

@Injectable()
export class CsvService<T extends object> implements RepositoryInterface<T> {
  private collection: T[];
  private indexes: Record<string, Record<string, T>> = {};

  constructor(
    private readonly logger: LoggerService,
    @Inject(CSV_VALIDATOR)
    private readonly validator: Type<T>,
  ) {}

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
        this.logger.warning(
          `"row n°${
            i + 1
          }" was excluded from the result at DTO validation :${message}`,
        );
        return null;
      }
      return result;
    };
    const extracted: T[] = [];
    /**
     * @NOTE Large INSEE datasets must not retain one pending DTO validation
     * per row at the same time.
     */
    for (const [index, row] of rawRows.entries()) {
      extracted.push(await validator(row, index));
    }
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
      this.collection = data;
      // You can't remove the catch argument, it's mandatory
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new CsvParsingException();
    }
  }

  createIndex(column: string): void {
    this.indexes[column] = {};

    this.collection.forEach((row) => {
      this.indexes[column][row[column]] = row;
    });
  }

  getByIndex(index: string, key: string): T | null {
    return this.indexes[index][key] || null;
  }

  filter(filters: { [key: string]: string }): T[] {
    const criteria = Object.entries(filters);

    return this.collection.filter((row) => this.matches(row, criteria));
  }

  // Needed to match the interface
  // eslint-disable-next-line require-await
  async find(filters: { [key: string]: string }): Promise<T | null> {
    const criteria = Object.entries(filters);

    const result = this.collection.find((row) => this.matches(row, criteria));
    return result || null;
  }

  private matches(row: T, criteria: [string, string][]): boolean {
    return criteria.every(([key, value]) => key in row && row[key] == value);
  }
}
