import { join } from 'path';

import { InseeDbCountryCurrentInterface } from '../interface';

export function getCwdForDirectory(directory: string): string {
  const pathDirectory = join(process.cwd(), '..', directory);
  return pathDirectory;
}

export function replaceAllOccurrences(
  input: string,
  finds: string[] | string,
  replace: string,
): string {
  const regexPattern = Array.isArray(finds) ? finds.join('|') : finds;
  const search = new RegExp(regexPattern, 'g');
  return input.replace(search, replace);
}

export function ReplaceEmptyIsoCode(
  codeiso2: string | undefined,
  crpay: string | undefined,
  csvData: InseeDbCountryCurrentInterface[],
): string | undefined {
  if (codeiso2) {
    return codeiso2;
  }

  if (!crpay) {
    return undefined;
  }

  const matchingRow = csvData.find(({ COG }) => COG === crpay);

  return matchingRow?.CODEISO2;
}
