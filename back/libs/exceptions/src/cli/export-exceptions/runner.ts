import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { Type } from '@nestjs/common';

import {
  ExceptionsService,
  FcException,
  IExceptionDocumentation,
} from '@fc/exceptions';

import { Description, Loggable, Trackable } from '../../decorator';
import {
  ExceptionClass,
  PathAndException,
  PathAndInstantiatedException,
} from '../../types';
import MarkdownGenerator from './markdown-generator';

/**
 * @todo Refacto le runner
 * @author Olivier
 * @date 2021-07-02
 */

export default class Runner {
  static extractException(args: {
    path: string;
    module: ExceptionClass;
  }): PathAndException {
    const Exception: Type<FcException> = Object.values(args.module).find(
      (property) => property.prototype instanceof FcException,
    );
    return { path: args.path, Exception };
  }

  static hasValidParam(param: number): boolean {
    return typeof param === 'number' && param >= 0;
  }

  static inflateException({
    path,
    Exception,
  }: PathAndException): PathAndInstantiatedException {
    const error = new Exception(new Error());
    const { scope, code } = error;
    const hasValidScope = Runner.hasValidParam(scope);
    const hasValidCode = Runner.hasValidParam(code);
    const isException = hasValidScope && hasValidCode;
    if (!isException) return null;
    return { path, error };
  }

  static buildException({
    path,
    error,
  }: PathAndInstantiatedException): IExceptionDocumentation {
    const {
      scope,
      code,
      message,
      constructor: { name: exception },
    } = error;
    const errorCode = ExceptionsService.getCode(scope, code);
    const loggable = Loggable.isLoggable(error);
    const trackable = Trackable.isTrackable(error);
    const description = Description.getDescription(error);

    const data = {
      scope,
      code,
      errorCode,
      message,
      loggable,
      trackable,
      description,
      path,
      exception,
    };

    return data;
  }

  static async loadExceptions(
    paths: string[],
  ): Promise<IExceptionDocumentation[]> {
    const infos = paths.map((path) => import(path));
    const modules = await Promise.all(infos);

    return modules
      .map((module, index) => ({ path: paths[index], module }))
      .map(Runner.extractException)
      .filter(({ Exception }) => Boolean(Exception))
      .map(Runner.inflateException)
      .filter(Boolean)
      .map(Runner.buildException);
  }

  static getExceptionsFilesPath(
    basePath = '@(libs|apps)',
    searchPattern = '/**/*.exception.ts',
  ): string[] {
    const pattern = `${basePath}${searchPattern}`;
    const paths = glob.sync(pattern);
    return paths;
  }

  static renderFile(file: string, data: object): Promise<string> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(file, data, (err: Error, result: string) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

  static async run(): Promise<void> {
    console.log('Generating documentation for exceptions...');
    const paths = Runner.getExceptionsFilesPath();
    const loaded = await Runner.loadExceptions(paths);
    const markdown = MarkdownGenerator.generate(loaded);
    const inputFile = `${__dirname}/view/erreurs.ejs`;
    const projectRootPath = '../';
    const page = await Runner.renderFile(inputFile, {
      markdown,
      projectRootPath,
    });
    fs.writeFileSync('_doc/erreurs.md', page);
  }
}
