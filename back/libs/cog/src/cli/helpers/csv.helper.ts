import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import * as csvParser from 'csv-parser';

import { generateCSVContent } from '@fc/csv';

import { FilesName } from '../enums';
import { SearchDbCountryInterface } from '../interface';
import { getCwdForDirectory } from './utils.helper';

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

export function saveCsvToFile(
  data: SearchDbCountryInterface[],
  folderDirectory: string,
): void {
  const targetDirectory = getCwdForDirectory(folderDirectory);
  const filenameCsv = FilesName.COUNTRY;
  // exports added for jest test mocked
  const fileContent = generateCSVContent(data);

  if (!existsSync(targetDirectory)) {
    mkdirSync(targetDirectory, { recursive: true });
    console.log(`Directory "${targetDirectory}" has been created`);
  }

  const filePath = join(targetDirectory, filenameCsv);

  writeFileSync(filePath, fileContent, { encoding: 'utf8' });
  console.log(`${filenameCsv} was created with success into ${filePath}`);
}
