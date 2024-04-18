import * as fs from 'fs';

import * as ejs from 'ejs';
import * as glob from 'glob';

import { FcException } from '@fc/exceptions-deprecated';

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
      // Given
      const MockAbstractFunction = jest.fn();
      class MockException extends FcException {}
      const module = { MockException, MockAbstractFunction };
      // When
      const result = Runner.extractException({ path, module });
      // Then
      expect(result).toStrictEqual({ path, Exception: MockException });
    });
  });

  describe('hasValidString', () => {
    it('Should return true if param is a valid string', () => {
      // Given
      const paramMock = 'foo bar';

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('Should return false if param is a null', () => {
      // Given
      const paramMock = null;

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('Should return false if param is undefined', () => {
      // Given
      const paramMock = undefined;

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('Should return false if param is an emtpy string', () => {
      // Given
      const paramMock = ' ';

      // When
      const result = Runner.hasValidString(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('hasValidException', () => {
    it('Should return true if param is positive number', () => {
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

    it('Should return false if hasValidScope is false', () => {
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

    it('Should return false if hasValidCode is false', () => {
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

    it('Should return false if hasValidHttpStatusCode is false', () => {
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

    it('Should return false if hasValidError is false', () => {
      // Given
      const paramMock = {
        hasValidScope: true,
        hasValidCode: true,
        hasValidHttpStatusCode: true,
        hasValidError: false,
        hasValidErrorDescription: true,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });

    it('Should return false if hasValidErrorDescription is false', () => {
      // Given
      const paramMock = {
        hasValidScope: true,
        hasValidCode: true,
        hasValidHttpStatusCode: true,
        hasValidError: true,
        hasValidErrorDescription: false,
      };

      // When
      const result = Runner.hasValidException(paramMock);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('hasValidNumber', () => {
    it('Should return true if param is positive number', () => {
      // Given
      const paramMock = 2;

      // When
      const result = Runner.hasValidNumber(paramMock);

      // Then
      expect(result).toStrictEqual(true);
    });
    it('Should return false if param is a negative number', () => {
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

    it('should return the path of the error, the instance of Error and error message if Exception has valid scope code, error and error description', () => {
      // When
      class MockException extends FcException {
        public code = 1;
        public scope = 1;
        static ERROR = 'error';
        static ERROR_DESCRIPTION = 'error description';
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual({
        path,
        errorInstance: expect.any(FcException),
        error: {
          ERROR: MockException['ERROR'],
          ERROR_DESCRIPTION: MockException['ERROR_DESCRIPTION'],
        },
      });
    });

    it('should return the path, the instance of Error and error message even if scope = 0 and code = 0', () => {
      // When
      class MockException extends FcException {
        public code = 0;
        public scope = 0;
        static ERROR = 'error';
        static ERROR_DESCRIPTION = 'error description';
      }
      const result = Runner.inflateException({
        path,
        Exception: MockException,
      });
      // Then
      expect(result).toStrictEqual({
        path,
        errorInstance: expect.any(FcException),
        error: {
          ERROR: MockException['ERROR'],
          ERROR_DESCRIPTION: MockException['ERROR_DESCRIPTION'],
        },
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

    it('Should reject the promise caused by invalid params', async () => {
      // Given
      jest
        .spyOn(ejs, 'renderFile')
        .mockImplementationOnce(renderFileMockErrorImplementation);
      // Then
      await expect(Runner.renderFile(file, dataMock)).rejects.toEqual('error');
    });
    it('Should return result from ejs renderFile', async () => {
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
    it('Should return an array of instances of IExceptionDocumentation', async () => {
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
          scope: 1,
          code: 2,
          httpStatusCode: 500,
          errorCode: 'Y010002',
          message: 'any',
          loggable: true,
          trackable: false,
          description: 'N/A',
          path: paths[0],
          exception: 'ImportFixture',
          ERROR: 'error',
          ERROR_DESCRIPTION: 'error description',
        },
        {
          scope: 2,
          code: 2,
          httpStatusCode: 500,
          errorCode: 'Y020002',
          message: 'any',
          loggable: true,
          trackable: false,
          description: 'N/A',
          path: paths[1],
          exception: 'ImportFixture',
          ERROR: 'error',
          ERROR_DESCRIPTION: 'error description',
        },
      ]);
    });
  });

  describe('getExceptionsFilesPath', () => {
    it('Should call glob.sync', () => {
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

    it('Should return result of glob.sync', () => {
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
      // When
      await Runner.run();
      // Then
      expect(Runner.loadExceptions).toHaveBeenCalledTimes(1);
      expect(Runner.loadExceptions).toHaveBeenCalledWith(
        getExceptionsFilesPathResult,
      );
    });

    it('Should call generate with loadExceptions result', async () => {
      // When
      await Runner.run();
      // Then
      expect(generatorSpy).toHaveBeenCalledTimes(1);
      expect(generatorSpy).toHaveBeenCalledWith(loadExceptionsResult);
    });

    it('Should call renderFile with generate result', async () => {
      // Given
      const projectRootPath = '../';
      // When
      await Runner.run();
      // Then
      expect(Runner.renderFile).toHaveBeenCalledTimes(1);
      expect(Runner.renderFile).toHaveBeenCalledWith(expect.any(String), {
        markdown: markdownGenerateResult,
        projectRootPath,
      });
    });

    it('Should call fs.writeFileSync with renderFile result', async () => {
      // When
      await Runner.run();
      // Then
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '_doc/erreurs.md',
        renderFileResult,
      );
    });
  });
});
