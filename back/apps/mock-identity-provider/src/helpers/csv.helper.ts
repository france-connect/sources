import { parseFile, ParserOptionsArgs } from '@fast-csv/parse';

import { parseBoolean } from '@fc/common';

import { Csv, CsvParsed } from '../interfaces';

// We actually return a promise
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

/**
 *  Convert specified columns from string to boolean
 */
export function transformColumnsIntoBoolean(
  database: Csv[],
  columsToConvertIntoBoolean: string[],
): CsvParsed[] {
  database.forEach((entry: CsvParsed) => {
    const convertIntoBoolean = (key: string) => {
      if (columsToConvertIntoBoolean.indexOf(key) < 0) return entry;
      entry[key] = parseBoolean(entry[key]);
      // we force not recognized value in false boolean
      if (!entry[key]) entry[key] = false;
    };
    Object.keys(entry).forEach(convertIntoBoolean);
  });

  return database;
}

/**
 *  Remove empty properties, i.e: {property1: '1', property2: ''} => {property1: '1'}
 */
export function removeEmptyProperties(database: Csv[]) {
  database.forEach((entry) => {
    const cleaner = (key: string) => entry[key] === '' && delete entry[key];
    Object.keys(entry).forEach(cleaner);
  });

  return database;
}
