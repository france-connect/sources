import { parseFile, ParserOptionsArgs } from '@fast-csv/parse';

import { Csv } from '../interfaces';

// Actually returns a promise
// eslint-disable-next-line require-await
export async function parseCsv(
  file: string,
  opts: ParserOptionsArgs,
): Promise<Csv[]> {
  const rows: Csv[] = [];

  return new Promise((resolve, reject) => {
    parseFile(file, opts)
      .on('error', reject)
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve(rows));
  });
}
