import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { HttpStatus, Type } from '@nestjs/common';

import {
  ExceptionsService,
  FcException,
  IExceptionDocumentation,
} from '@fc/exceptions';
import {
  Description as DescriptionDeprecated,
  FcException as FcDeprecatedException,
} from '@fc/exceptions-deprecated';

import {
  DEFAULT_DESCRIPTION_VALUE,
  Description,
  Loggable,
  Trackable,
} from '../../decorator';
import {
  ExceptionClass,
  PathAndException,
  PathAndInstantiatedException,
  ValidExceptionParams,
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
      (property) =>
        property.prototype instanceof FcException ||
        property.prototype instanceof FcDeprecatedException,
    );
    return { path: args.path, Exception };
  }

  static hasValidNumber(param: number): boolean {
    return typeof param === 'number' && param >= 0;
  }

  static hasValidString(param: string): boolean {
    return (
      typeof param === 'string' &&
      param !== null &&
      param !== undefined &&
      param.trim() !== ''
    );
  }

  static hasValidHttpStatusCode(param: number): boolean {
    return (
      typeof param === 'number' && Object.values(HttpStatus).includes(param)
    );
  }

  // eslint-disable-next-line complexity
  static hasValidException({
    hasValidScope,
    hasValidCode,
    hasValidHttpStatusCode,
    hasValidError,
    hasValidErrorDescription,
  }: ValidExceptionParams): boolean {
    return (
      hasValidScope &&
      hasValidCode &&
      hasValidHttpStatusCode &&
      hasValidError &&
      hasValidErrorDescription
    );
  }

  static inflateException({
    path,
    Exception,
  }: PathAndException): PathAndInstantiatedException | null {
    const errorInstance = new Exception(new Error());
    const { scope, code, httpStatusCode } = errorInstance;

    // Retrieve static error and error description props
    const errorCustom = Exception['ERROR'];
    const errorDescriptionCustom = Exception['ERROR_DESCRIPTION'];

    const hasValidScope = Runner.hasValidNumber(scope);
    const hasValidCode = Runner.hasValidNumber(code);
    const hasValidHttpStatusCode =
      Runner.hasValidHttpStatusCode(httpStatusCode);
    const hasValidError = Runner.hasValidString(errorCustom);
    const hasValidErrorDescription = Runner.hasValidString(
      errorDescriptionCustom,
    );

    const isException = Runner.hasValidException({
      hasValidScope,
      hasValidCode,
      hasValidHttpStatusCode,
      hasValidError,
      hasValidErrorDescription,
    });

    if (!isException) return null;

    return {
      path,
      errorInstance,
      error: { ERROR: errorCustom, ERROR_DESCRIPTION: errorDescriptionCustom },
    };
  }

  static buildException({
    path,
    error,
    errorInstance,
  }: PathAndInstantiatedException): IExceptionDocumentation {
    const {
      scope,
      code,
      httpStatusCode,
      message,
      constructor: { name: exception },
    } = errorInstance;

    const { ERROR, ERROR_DESCRIPTION } = error;

    const errorCode = ExceptionsService.getCode(scope, code);
    const loggable = Loggable.isLoggable(errorInstance);
    const trackable = Trackable.isTrackable(errorInstance);
    let description = Description.getDescription(errorInstance);
    // get all descriptions from deprecated decorator
    if (description === DEFAULT_DESCRIPTION_VALUE) {
      description = DescriptionDeprecated.getDescription(errorInstance);
    }

    const data = {
      scope,
      code,
      errorCode,
      httpStatusCode,
      message,
      loggable,
      trackable,
      description,
      path,
      exception,
      ERROR,
      ERROR_DESCRIPTION,
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
