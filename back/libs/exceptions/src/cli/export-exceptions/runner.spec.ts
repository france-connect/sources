import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { FcException } from '@fc/exceptions';

import MarkdownGenerator from './markdown-generator';
import Runner from './runner';

jest.mock('fs');
jest.mock('console');
jest.mock('ejs');
jest.mock('glob');
jest.mock('./markdown-generator');

describe('Runner', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const path = '/my/file/is/here.exception.ts';
  describe('extractException', () => {
    it('Should return the path of the exception and the Class extending FcException from a module', () => {
      // Setup
      const MockAbstractFunction = jest.fn();
      class MockException extends FcException {}
      const module = { MockException, MockAbstractFunction };
      // Actions
      const result = Runner.extractException({ path, module });
      // Expect
      expect(result).toStrictEqual({ path, Exception: MockException });
    });
  });

  describe('hasValidParam', () => {
    it('Should return true if param is positive number', () => {
      // Setup
      const paramMock = 2;

      // Action
      const result = Runner.hasValidParam(paramMock);

      // Expect
      expect(result).toStrictEqual(true);
    });
    it('Should return false if param is a negative number', () => {
      // Setup
      const paramMock = -1;

      // Action
      const result = Runner.hasValidParam(paramMock);

      // Expect
      expect(result).toStrictEqual(false);
    });
  });

  describe('inflateException', () => {
    it('should return null if Exception has invalid scope and/or code', () => {
      // Setup
      const expected = null;
      // Actions
      class MockException extends FcException {}
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Expect
      expect(result).toStrictEqual(expected);
    });

    it('should return the path of the error and an instance of Error if Exception has valid scope and code', () => {
      // Actions
      class MockException extends FcException {
        public code = 1;
        public scope = 1;
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Expect
      expect(result).toStrictEqual({ path, error: expect.any(FcException) });
    });

    it('should return the path of the error and an instance of Error if Exception has valid scope = 0 and code = 0', () => {
      // Actions
      class MockException extends FcException {
        public code = 0;
        public scope = 0;
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Expect
      expect(result).toStrictEqual({ path, error: expect.any(FcException) });
    });
  });

  describe('renderFile', () => {
    // Setup
    const file = 'none.file';
    const dataMock = [];
    const renderFileResult = [Symbol('renderFileResult')];

    const renderFileMockErrorImplementation = (
      _a: string,
      _b: unknown,
      callback,
    ) => callback('error');

    const renderFileMockSuccesImplementation = (
      _a: string,
      _b: unknown,
      callback,
    ) => callback(null, renderFileResult);

    it('Should reject the promise caused by invalid params', async () => {
      // Setup
      jest
        .spyOn(ejs, 'renderFile')
        .mockImplementationOnce(renderFileMockErrorImplementation);
      // Expect
      await expect(Runner.renderFile(file, dataMock)).rejects.toEqual('error');
    });
    it('Should return result from ejs renderFile', async () => {
      // Setup
      jest
        .spyOn(ejs, 'renderFile')
        .mockImplementationOnce(renderFileMockSuccesImplementation);
      // Action
      const result = await Runner.renderFile(file, dataMock);
      // Expect
      expect(result).toEqual(renderFileResult);
    });
  });

  describe('loadExceptions', () => {
    it('Should return an array of instances of IExceptionDocumentation', async () => {
      // Setup
      const paths = [
        './fixtures/module.exception.fixture',
        './fixtures/module-2.exception.fixture',
      ];
      // Actions
      const result = await Runner.loadExceptions(paths);
      // Expect
      expect(result).toStrictEqual([
        {
          scope: 1,
          code: 2,
          errorCode: 'Y010002',
          message: 'any',
          loggable: true,
          trackable: false,
          description: 'N/A',
          path: paths[0],
          exception: 'ImportFixture',
        },
        {
          scope: 2,
          code: 2,
          errorCode: 'Y020002',
          message: 'any',
          loggable: true,
          trackable: false,
          description: 'N/A',
          path: paths[1],
          exception: 'ImportFixture',
        },
      ]);
    });
  });

  describe('getExceptionsFilesPath', () => {
    it('Should call glob.sync', () => {
      // Setup
      jest.spyOn(glob, 'sync').mockImplementation();
      const basePath = 'foobar';
      const pattern = '/**/*.exception.ts';
      const filePaths = `${basePath}${pattern}`;
      // Actions
      Runner.getExceptionsFilesPath(basePath, pattern);
      // Expect
      expect(glob.sync).toHaveBeenCalledTimes(1);
      expect(glob.sync).toHaveBeenCalledWith(filePaths);
    });

    it('Should return result of glob.sync', () => {
      // Setup
      const globSyncResult = ['globSyncResult'];
      jest.spyOn(glob, 'sync').mockImplementation(() => globSyncResult);
      // Actions
      const result = Runner.getExceptionsFilesPath();
      // Expect
      expect(result).toBe(globSyncResult);
    });
  });

  describe('run', () => {
    // Setup
    const getExceptionsFilesPathResult = [];
    const loadExceptionsResult = [];
    const markdownGenerateResult = [];
    const renderFileResult = '';
    const generatorSpy = jest.spyOn(MarkdownGenerator, 'generate');

    beforeEach(() => {
      generatorSpy.mockImplementation(() => markdownGenerateResult);
      // Inhibate library function
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      // Inhibate library function
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(console, 'log').mockImplementation(() => {});

      Runner.renderFile = jest.fn().mockResolvedValue(renderFileResult);
      Runner.loadExceptions = jest.fn().mockResolvedValue(loadExceptionsResult);
      Runner.getExceptionsFilesPath = jest
        .fn()
        .mockImplementation(() => getExceptionsFilesPathResult);
    });

    it('Should call loadExceptions with getExceptionsFilesPath result', async () => {
      // Actions
      await Runner.run();
      // Expect
      expect(Runner.loadExceptions).toHaveBeenCalledTimes(1);
      expect(Runner.loadExceptions).toHaveBeenCalledWith(
        getExceptionsFilesPathResult,
      );
    });

    it('Should call generate with loadExceptions result', async () => {
      // Actions
      await Runner.run();
      // Expect
      expect(generatorSpy).toHaveBeenCalledTimes(1);
      expect(generatorSpy).toHaveBeenCalledWith(loadExceptionsResult);
    });

    it('Should call renderFile with generate result', async () => {
      // Setup
      const projectRootPath = '../';
      // Actions
      await Runner.run();
      // Expect
      expect(Runner.renderFile).toHaveBeenCalledTimes(1);
      expect(Runner.renderFile).toHaveBeenCalledWith(expect.any(String), {
        markdown: markdownGenerateResult,
        projectRootPath,
      });
    });

    it('Should call fs.writeFileSync with renderFile result', async () => {
      // Actions
      await Runner.run();
      // Expect
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '_doc/erreurs.md',
        renderFileResult,
      );
    });
  });
});
