import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { HttpStatus } from '@nestjs/common';

import { FcException } from '../../exceptions';
import { ExceptionClass } from '../../types';
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
    it('should return the path of the exception and the Class extending FcException from a module', () => {
      // Given
      const MockAbstractFunction = jest.fn();
      class MockException extends FcException {}
      const module = {
        MockException,
        MockAbstractFunction,
      } as unknown as ExceptionClass;
      // When
      const result = Runner.extractException({ path, module });
      // Then
      expect(result).toStrictEqual({ path, Exception: MockException });
    });

    it('should return undefined if no exception is found in module', () => {
      // Given
      const MockAbstractFunction = jest.fn();
      const module = {
        MockAbstractFunction,
      } as unknown as ExceptionClass;
      // When
      const result = Runner.extractException({ path, module });
      // Then
      expect(result).not.toBeDefined();
    });
  });

  describe('hasValidString', () => {
    it('should return true if param is a valid string', () => {
      // Given
      const paramMock = 'foo bar';

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return false if param is a null', () => {
      // Given
      const paramMock = null;

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if param is undefined', () => {
      // Given
      const paramMock = undefined;

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if param is an emtpy string', () => {
      // Given
      const paramMock = ' ';

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('hasValidException', () => {
    it('should return true if param is positive number', () => {
      // Given
      const paramMock = {
        hasValidScope: true,
        hasValidCode: true,
        hasValidHttpStatusCode: true,
        hasValidError: true,
        hasValidErrorDescription: true,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return false if hasValidScope is false', () => {
      // Given
      const paramMock = {
        hasValidScope: false,
        hasValidCode: true,
        hasValidHttpStatusCode: true,
        hasValidError: true,
        hasValidErrorDescription: true,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if hasValidCode is false', () => {
      // Given
      const paramMock = {
        hasValidScope: true,
        hasValidCode: false,
        hasValidHttpStatusCode: true,
        hasValidError: true,
        hasValidErrorDescription: true,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('should return false if hasValidHttpStatusCode is false', () => {
      // Given
      const paramMock = {
        hasValidScope: true,
        hasValidCode: true,
        hasValidHttpStatusCode: false,
        hasValidError: true,
        hasValidErrorDescription: true,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('hasValidNumber', () => {
    it('should return true if param is positive number', () => {
      // Given
      const paramMock = 2;

      // When
      const result = Runner.hasValidNumber(paramMock);

      // Then
      expect(result).toStrictEqual(true);
    });
    it('should return false if param is a negative number', () => {
      // Given
      const paramMock = -1;

      // When
      const result = Runner.hasValidNumber(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('inflateException', () => {
    it('should return null if Exception has invalid scope and/or code', () => {
      // Given
      const expected = null;
      // When
      class MockException extends FcException {}
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return null if Exception has invalid error and/or error_description', () => {
      // Given
      class MockException extends FcException {
        public code = 1;
        public scope = 1;
      }
      const expected = null;
      // When
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return the path of the error, the class of Error if Exception has valid SCOPE and CODE', () => {
      // When
      class MockException extends FcException {
        static CODE = 1;
        static SCOPE = 1;
        static ERROR = 'error';
        static ERROR_DESCRIPTION = 'error description';
        static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual({
        path,
        Exception: MockException,
      });
    });

    it('should return the path and class even if SCOPE = 0 and CODE = 0', () => {
      // When
      class MockException extends FcException {
        static CODE = 0;
        static SCOPE = 0;
        static ERROR = 'error';
        static ERROR_DESCRIPTION = 'error description';
        static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual({
        path,
        Exception: MockException,
      });
    });
  });

  describe('renderFile', () => {
    // Given
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

    it('should reject the promise caused by invalid params', async () => {
      // Given
      jest
        .spyOn(ejs, 'renderFile')
        .mockImplementationOnce(renderFileMockErrorImplementation);
      // Then
      await expect(Runner.renderFile(file, dataMock)).rejects.toEqual('error');
    });
    it('should return result from ejs renderFile', async () => {
      // Given
      jest
        .spyOn(ejs, 'renderFile')
        .mockImplementationOnce(renderFileMockSuccesImplementation);
      // When
      const result = await Runner.renderFile(file, dataMock);
      // Then
      expect(result).toEqual(renderFileResult);
    });
  });

  describe('loadExceptions', () => {
    it('should return an array of instances of ExceptionDocumentationInterface', async () => {
      // Given
      const paths = [
        './fixtures/module.exception.fixture',
        './fixtures/module-2.exception.fixture',
      ];
      // When
      const result = await Runner.loadExceptions(paths);
      // Then
      expect(result).toStrictEqual([
        {
          DOCUMENTATION: 'documentation',
          SCOPE: 1,
          CODE: 2,
          HTTP_STATUS_CODE: 500,
          LOG_LEVEL: 20,
          UI: 'ui',
          errorCode: '010002',
          exception: 'ImportFixture',
          path: paths[0],
          ERROR: 'error',
          ERROR_DESCRIPTION: 'error description',
          translated: undefined,
        },
        {
          DOCUMENTATION: 'documentation',
          SCOPE: 2,
          CODE: 2,
          HTTP_STATUS_CODE: 500,
          LOG_LEVEL: 20,
          UI: 'ui',
          errorCode: '020002',
          exception: 'ImportFixture2',
          path: paths[1],
          ERROR: 'error',
          ERROR_DESCRIPTION: 'error description',
          translated: undefined,
        },
      ]);
    });
  });

  describe('getExceptionsFilesPath', () => {
    it('should call glob.sync', () => {
      // Given
      jest.spyOn(glob, 'sync').mockImplementation();
      const basePath = 'foobar';
      const pattern = '/**/*.exception.ts';
      const filePaths = `${basePath}${pattern}`;
      // When
      Runner.getExceptionsFilesPath(basePath, pattern);
      // Then
      expect(glob.sync).toHaveBeenCalledTimes(1);
      expect(glob.sync).toHaveBeenCalledWith(filePaths);
    });

    it('should return result of glob.sync', () => {
      // Given
      const globSyncResult = ['globSyncResult'];
      jest.spyOn(glob, 'sync').mockImplementation(() => globSyncResult);
      // When
      const result = Runner.getExceptionsFilesPath();
      // Then
      expect(result).toBe(globSyncResult);
    });
  });

  describe('run', () => {
    // Given
    const getExceptionsFilesPathResult = [];
    const loadExceptionsResult = [{ SCOPE: 2 }, { SCOPE: 4 }, { SCOPE: 6 }];
    const markdownGenerateResult = [];
    const renderFileResult = '';
    const generatorSpy = jest.spyOn(MarkdownGenerator, 'generate');

    beforeEach(() => {
      generatorSpy.mockImplementation(() => markdownGenerateResult);
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(console, 'log').mockImplementation(() => {});

      Runner.renderFile = jest.fn().mockResolvedValue(renderFileResult);
      Runner.loadExceptions = jest.fn().mockResolvedValue(loadExceptionsResult);
      Runner.getExceptionsFilesPath = jest
        .fn()
        .mockImplementation(() => getExceptionsFilesPathResult);
    });

    it('should call loadExceptions with getExceptionsFilesPath result', async () => {
      // When
      await Runner.run();
      // Then
      expect(Runner.loadExceptions).toHaveBeenCalledTimes(1);
      expect(Runner.loadExceptions).toHaveBeenCalledWith(
        getExceptionsFilesPathResult,
      );
    });

    it('should call generate with loadExceptions result', async () => {
      // When
      await Runner.run();
      // Then
      expect(generatorSpy).toHaveBeenCalledTimes(2);
      expect(generatorSpy).toHaveBeenNthCalledWith(1, [
        { SCOPE: 2 },
        { SCOPE: 6 },
      ]);
      expect(generatorSpy).toHaveBeenNthCalledWith(2, [{ SCOPE: 4 }]);
    });

    it('should call renderFile with generate result', async () => {
      // Given
      const projectRootPath = '../';
      // When
      await Runner.run();
      // Then
      expect(Runner.renderFile).toHaveBeenCalledTimes(2);
      expect(Runner.renderFile).toHaveBeenNthCalledWith(1, expect.any(String), {
        markdown: markdownGenerateResult,
        projectRootPath,
        title: 'Code erreurs généraux',
      });
      expect(Runner.renderFile).toHaveBeenNthCalledWith(2, expect.any(String), {
        markdown: markdownGenerateResult,
        projectRootPath,
        title: 'Code erreurs spécifiques OIDC Provider',
      });
    });

    it('should call fs.writeFileSync with renderFile result', async () => {
      // When
      await Runner.run();
      // Then
      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '_doc/erreurs.md',
        renderFileResult,
      );
    });
  });
});
