import { join } from 'path';

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
