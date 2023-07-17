import * as recursive from 'recursive-readdir';

export const NON_CSV_GLOBAL = '!*.csv';

export async function getFilesPathsFromDir(dirPath: string): Promise<string[]> {
  return await recursive(dirPath, [NON_CSV_GLOBAL]);
}
