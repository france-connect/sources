import { createReadStream } from 'fs';

import * as csvParser from 'csv-parser';

export function readCSV(csvFilePath: string): any {
  return new Promise((resolve, reject) => {
    const results = [];

    // Read the CSV file and convert to object array
    createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export function createCSV(data): any {
  const csvContent = [];
  const headers = Object.keys(data[0]);
  csvContent.push(headers.join(','));

  data.forEach((item) => {
    // eslint-disable-next-line max-nested-callbacks
    const values = headers.map((header) => item[header]);
    csvContent.push(values.join(','));
  });

  return csvContent.join('\n');
}
