import { join } from 'path';

export function getParameterValue(
  args: string[],
  index: number,
): string | undefined {
  return args.length > 0 && args[index] ? args[index] : undefined;
}

export function getCwdForDirectory(directory: string): string {
  const pathDirectory = join(process.cwd(), '..', directory);
  return pathDirectory;
}
