import { existsSync, promises as fsAsync } from 'fs';

import * as ejs from 'ejs';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  async readFile(path): Promise<string> {
    return fsAsync.readFile(path, 'utf-8');
  }

  render(template, values): string {
    return ejs.render(template, values);
  }

  getFilePath(fileName: string, dirPaths: string[]): string {
    return dirPaths
      .map((dirPath) => `${dirPath}/${fileName}`)
      .filter((filePath) => existsSync(filePath))
      .pop();
  }
}
