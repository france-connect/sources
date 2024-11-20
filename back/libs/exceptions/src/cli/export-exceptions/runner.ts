import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { HttpStatus } from '@nestjs/common';

import { frFR } from '../../../../../apps/core-fcp/src/i18n/fr-FR.i18n';
import { BaseException } from '../../exceptions';
import { getCode } from '../../helpers';
import {
  ExceptionClass,
  ExceptionDocumentationInterface,
  PathAndException,
  PathAndInstantiatedException,
  ValidExceptionParams,
} from '../../types';
import MarkdownGenerator from './markdown-generator';

const OIDC_PROVIDER_RUNTIME_SCOPE = 4;

export default class Runner {
  static extractException(args: {
    path: string;
    module: ExceptionClass;
  }): PathAndException | undefined {
    const Exception: typeof BaseException | undefined = Object.values(
      args.module,
    ).find((property) =>
      BaseException.prototype.isPrototypeOf(property.prototype),
    );

    if (!Exception) {
      return undefined;
    }

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

  static hasValidException({
    hasValidScope,
    hasValidCode,
    hasValidHttpStatusCode,
  }: ValidExceptionParams): boolean {
    return hasValidScope && hasValidCode && hasValidHttpStatusCode;
  }

  static inflateException({
    path,
    Exception,
  }: PathAndException): PathAndInstantiatedException | null {
    const { SCOPE, CODE, HTTP_STATUS_CODE } = Exception;

    // Retrieve static error and error description props
    const hasValidScope = Runner.hasValidNumber(SCOPE);
    const hasValidCode = typeof CODE === 'number' || typeof CODE === 'string';
    const hasValidHttpStatusCode =
      Runner.hasValidHttpStatusCode(HTTP_STATUS_CODE);

    const isException = Runner.hasValidException({
      hasValidScope,
      hasValidCode,
      hasValidHttpStatusCode,
    });

    if (!isException) return null;

    return {
      path,
      Exception,
    };
  }

  static buildException({
    path,
    Exception,
  }: PathAndInstantiatedException): ExceptionDocumentationInterface {
    const {
      SCOPE,
      CODE,
      HTTP_STATUS_CODE,
      ERROR,
      ERROR_DESCRIPTION,
      UI,
      LOG_LEVEL,
      DOCUMENTATION,
    } = Exception;

    const errorCode = getCode(SCOPE, CODE);

    const data = {
      SCOPE,
      CODE,
      errorCode,
      exception: Exception.name,
      HTTP_STATUS_CODE,
      UI,
      translated: frFR[UI],
      DOCUMENTATION,
      LOG_LEVEL,
      path,
      ERROR,
      ERROR_DESCRIPTION,
    };

    return data;
  }

  static async loadExceptions(
    paths: string[],
  ): Promise<ExceptionDocumentationInterface[]> {
    const infos = paths.map((path) => import(path));
    const modules = await Promise.all(infos);

    return modules
      .map((module, index) => ({ path: paths[index], module }))
      .map(Runner.extractException)
      .filter((Exception) => Boolean(Exception))
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

    const mainList = loaded.filter(
      (item) => item.SCOPE !== OIDC_PROVIDER_RUNTIME_SCOPE,
    );
    const oidcProviderRunTimeList = loaded.filter(
      (item) => item.SCOPE === OIDC_PROVIDER_RUNTIME_SCOPE,
    );

    const mainMarkdown = MarkdownGenerator.generate(mainList);
    const oprtMarkdown = MarkdownGenerator.generate(oidcProviderRunTimeList);

    const inputFile = `${__dirname}/view/erreurs.ejs`;
    const projectRootPath = '../';

    const mainPage = await Runner.renderFile(inputFile, {
      markdown: mainMarkdown,
      projectRootPath,
      title: 'Code erreurs généraux',
    });

    const oprtPage = await Runner.renderFile(inputFile, {
      markdown: oprtMarkdown,
      projectRootPath,
      title: 'Code erreurs spécifiques OIDC Provider',
    });

    fs.writeFileSync('_doc/erreurs.md', mainPage);
    fs.writeFileSync('_doc/erreurs-oidc-provider.md', oprtPage);
  }
}
