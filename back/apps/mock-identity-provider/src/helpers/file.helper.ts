import { readdirSync } from 'fs';
import { join } from 'path';

export const getFilesPathsFromDir = (dirPath) =>
  readdirSync(dirPath)
    // only takes data files
    .filter((filename) => filename.endsWith('.csv'))
    // prepend path to filename
    .map((filename) => join(dirPath, filename));
