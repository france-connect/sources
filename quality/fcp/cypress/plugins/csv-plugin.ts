import csvParser from 'csv-parser';
import { Readable } from 'stream';

export async function parseCsvContent(
  csvContent: string,
): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from([csvContent]);

    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
