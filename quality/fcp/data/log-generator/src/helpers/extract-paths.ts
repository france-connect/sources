import { DefaultMockDataPaths } from '../enums';
import { safelyParseJson } from './safely-parse-json';

export function extractPaths(pathArray: string, platform: string): string[] {
  let paths: string[];

  try {
    const values = safelyParseJson(pathArray);
    if (!Array.isArray(values)) {
      throw new Error(`${JSON.stringify(values)} is not an array`);
    }
    paths = values;
  } catch (error) {
    throw new Error(`Paths param must be a JSON array : ${error.message}`);
  }

  // Default value
  if (!paths.length) {
    paths = DefaultMockDataPaths[platform];
  }

  return paths;
}
