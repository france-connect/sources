import { DcqlInvalidMdocPathException } from '../exceptions';

const MDOC_JSON_PATH_PATTERN = /^\$\['([^']+)'\]\['([^']+)'\]$/;

export function parseMdocJsonPath(path: string): [string, string] {
  const match = MDOC_JSON_PATH_PATTERN.exec(path);

  if (!match) {
    throw new DcqlInvalidMdocPathException(path);
  }

  return [match[1], match[2]];
}
