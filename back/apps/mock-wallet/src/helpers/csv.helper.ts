import { parseFile, ParserOptionsArgs } from '@fast-csv/parse';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as recursive from 'recursive-readdir';

const NON_CSV_GLOB = '!*.csv';

export async function listCsvFiles(dirPath: string): Promise<string[]> {
  return await recursive(dirPath, [NON_CSV_GLOB]);
}

export async function parseCsvFile<T extends object>(
  path: string,
  dtoClass: ClassConstructor<T>,
  opts: ParserOptionsArgs = { headers: true, trim: true, ignoreEmpty: true },
): Promise<T[]> {
  const rows: T[] = [];

  return await new Promise((resolve, reject) => {
    parseFile(path, opts)
      .on('error', reject)
      .on('data', (row: Record<string, string>) =>
        rows.push(
          plainToInstance(dtoClass, row, { excludeExtraneousValues: true }),
        ),
      )
      .on('end', () => resolve(rows));
  });
}
