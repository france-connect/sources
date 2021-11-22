import { existsSync, readFileSync } from 'fs';

import { parseBoolean, parseJsonProperty } from '@fc/common';

import { IConfigParserFileOptions } from '../interfaces';

export class ConfigParser {
  constructor(
    private readonly source: any,
    private readonly namespace: string,
    private readonly separator = '_',
  ) {}

  private getFullPath(path: string): string {
    return `${this.namespace}${this.separator}${path}`;
  }

  boolean(path: string): boolean {
    const fullPath = this.getFullPath(path);
    return parseBoolean(this.source[fullPath]);
  }

  json(path: string): any {
    const fullPath = this.getFullPath(path);
    return parseJsonProperty(this.source, fullPath);
  }

  string(path: string): string {
    const fullPath = this.getFullPath(path);
    return this.source[fullPath];
  }

  number(path: string): number {
    const fullPath = this.getFullPath(path);
    return parseInt(this.source[fullPath], 10);
  }

  file(path: string, options: IConfigParserFileOptions = {}): string {
    const { optional } = options;

    const fullPath = this.getFullPath(path);
    const filePath = this.source[fullPath];

    const fileExists = existsSync(filePath);

    if (fileExists) {
      return readFileSync(filePath, 'utf-8');
    }

    if (optional) {
      return null;
    }

    throw new Error(`file at path ${filePath} is missing`);
  }
}
