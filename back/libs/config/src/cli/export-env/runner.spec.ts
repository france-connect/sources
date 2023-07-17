import { renderFile } from 'ejs';
import { readFile } from 'fs/promises';
import * as glob from 'glob';

import { MarkdownGenerator } from './markdown-generator';
import { Runner } from './runner';

jest.mock('ejs');
jest.mock('fs/promises');
jest.mock('glob');
jest.mock('./markdown-generator');

describe('Runner', () => {
  console.log = jest.fn();

  const FILE_SEARCH_PATTERN = 'instances/*/src/config/*.ts';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('run', () => {
    const pathsMock = Symbol('paths') as any;
    const configsMock = Symbol('configs') as any;
    const envMapMock = Symbol('envMap') as any;
    const markdownMock = Symbol('markdown') as any;
    const renderedFileMock = Symbol('renderedFile') as any;

    beforeEach(() => {
      jest.spyOn(Runner, 'getConfigFilesPath').mockReturnValue(pathsMock);
      jest.spyOn(Runner, 'loadConfigs').mockReturnValue(configsMock);
      jest.spyOn(Runner, 'buildEnvMap').mockReturnValue(envMapMock);
      jest.mocked(MarkdownGenerator.generate).mockReturnValue(markdownMock);
      jest.spyOn(Runner, 'renderFile').mockReturnValue(renderedFileMock);
    });

    it('should retrieves the config files path', async () => {
      // When
      await Runner.run();

      // Then
      expect(Runner.getConfigFilesPath).toHaveBeenCalledTimes(1);
      expect(Runner.getConfigFilesPath).toHaveBeenCalledWith();
    });

    it('should load the config files', async () => {
      // When
      await Runner.run();

      // Then
      expect(Runner.loadConfigs).toHaveBeenCalledTimes(1);
      expect(Runner.loadConfigs).toHaveBeenCalledWith(pathsMock);
    });

    it('should build the env map', async () => {
      // When
      await Runner.run();

      // Then
      expect(Runner.buildEnvMap).toHaveBeenCalledTimes(1);
      expect(Runner.buildEnvMap).toHaveBeenCalledWith(configsMock);
    });

    it('should generate the markdown', async () => {
      // When
      await Runner.run();

      // Then
      expect(MarkdownGenerator.generate).toHaveBeenCalledTimes(1);
      expect(MarkdownGenerator.generate).toHaveBeenCalledWith(envMapMock);
    });

    it('should render the file', async () => {
      // When
      await Runner.run();

      // Then
      expect(Runner.renderFile).toHaveBeenCalledTimes(1);
      expect(Runner.renderFile).toHaveBeenCalledWith(expect.any(String), {
        markdown: markdownMock,
      });
    });
  });

  describe('getConfigFilesPath', () => {
    const pathsMock = Symbol('paths') as any;

    it('should find all path using globs', () => {
      // Given
      jest.mocked(glob.sync).mockReturnValue(pathsMock);

      // When
      Runner.getConfigFilesPath();

      // Then
      expect(glob.sync).toHaveBeenCalledTimes(1);
      expect(glob.sync).toHaveBeenCalledWith(FILE_SEARCH_PATTERN);
    });

    it('should return the paths', () => {
      // Given
      jest.mocked(glob.sync).mockReturnValue(pathsMock);

      // When
      const result = Runner.getConfigFilesPath();

      // Then
      expect(result).toBe(pathsMock);
    });
  });

  describe('loadConfigs', () => {
    const pathsMock = ['path1', 'path2'];
    const filesContentMock = ['content1', 'content2'];

    beforeEach(() => {
      jest
        .mocked(readFile)
        .mockResolvedValueOnce(filesContentMock[0])
        .mockResolvedValueOnce(filesContentMock[1]);
    });

    it('read all files in paths', async () => {
      // When
      await Runner.loadConfigs(pathsMock);

      // Then
      expect(readFile).toHaveBeenCalledTimes(2);
      expect(readFile).toHaveBeenNthCalledWith(1, pathsMock[0], 'utf-8');
      expect(readFile).toHaveBeenNthCalledWith(2, pathsMock[1], 'utf-8');
    });

    it('should return the files', async () => {
      // Given
      const expected = [
        {
          path: pathsMock[0],
          file: filesContentMock[0],
        },
        {
          path: pathsMock[1],
          file: filesContentMock[1],
        },
      ];

      // When
      const result = await Runner.loadConfigs(pathsMock);

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('buildEnvMap', () => {
    it('should reduce the files using fileReducer', () => {
      // Given
      const filesMock = {
        reduce: jest.fn(),
      } as any;

      // When
      Runner.buildEnvMap(filesMock);

      // Then
      expect(filesMock.reduce).toHaveBeenCalledTimes(1);
      expect(filesMock.reduce).toHaveBeenCalledWith(Runner.filesReducer, {});
    });

    it('should return the result', () => {
      // Given
      const filesMock = {
        reduce: jest.fn(),
      } as any;
      const expected = Symbol('result') as any;
      jest.spyOn(filesMock, 'reduce').mockReturnValue(expected);

      // When
      const result = Runner.buildEnvMap(filesMock);

      // Then
      expect(result).toBe(expected);
    });
  });

  describe('filesReducer', () => {
    const filesMock = [
      {
        path: 'path1/instance1/src/config/file1.ts',
        file: "const env = new ConfigParser(process.env, 'Toto');\nissuer: `https://${process.env.FQDN}${env.string('PREFIX')}`",
      },
      {
        path: 'path1/instance1/src/config/file2.ts',
        file: "const env = new ConfigParser(process.env, 'Lolo');\nprefix: env.json('FOO_BAR_BU'),",
      },
      {
        path: 'path2/instance2/src/config/file1.ts',
        file: "const env = new ConfigParser(process.env, 'Toto');\ntimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),",
      },
      {
        path: 'path3/instance3/src/config/file1.ts',
        file: "const env = new ConfigParser(process.env, 'EdgeCase');\ntimeout: parseInt(process.env\n    .REQUEST_TIMEOUT, 10),",
      },
      {
        path: 'path3/instance3/src/config/file2.ts',
        file: "const env = new ConfigParser(process.env, 'EdgeCase');\nprefix: env.json(\n\n   'FOO_BAR_BU'\n   ),",
      },
    ] as any;

    it('should add all env variables to the map', () => {
      const envMapMock = {};
      // This is the format in environment variables
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const expected = { instance1: { FQDN: 'string', Toto_PREFIX: 'string' } };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[0]);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should not overwrite an existing instance', () => {
      // Given
      const envMapMock = {
        // This is the format in environment variables
        // eslint-disable-next-line @typescript-eslint/naming-convention
        instance1: { FQDN: 'string', Toto_PREFIX: 'string' },
      };
      const expected = {
        instance1: {
          FQDN: 'string',
          // This is the format in environment variables
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Lolo_FOO_BAR_BU: 'json',
          // This is the format in environment variables
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Toto_PREFIX: 'string',
        },
      };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[1]);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should not overwrite an existing the given env map', () => {
      // Given
      const envMapMock = {
        // This is the format in environment variables
        // eslint-disable-next-line @typescript-eslint/naming-convention
        instance1: { FQDN: 'string', Toto_PREFIX: 'string' },
      };
      const expected = {
        instance1: {
          FQDN: 'string',
          // This is the format in environment variables
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Toto_PREFIX: 'string',
        },
        instance2: {
          // This is the format in environment variables
          // eslint-disable-next-line @typescript-eslint/naming-convention
          REQUEST_TIMEOUT: 'string',
        },
      };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[2]);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return the env map', () => {
      // Given
      const envMapMock = {
        // This is the format in environment variables
        // eslint-disable-next-line @typescript-eslint/naming-convention
        instance1: { FQDN: 'string', Toto_PREFIX: 'string' },
      };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[2]);

      // Then
      expect(result).toBe(envMapMock);
    });

    it('should work event with cosmetic lines breaks in process.env', () => {
      // Given
      const envMapMock = {};
      // This is the format in environment variables
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const expected = { instance3: { REQUEST_TIMEOUT: 'string' } };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[3]);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should work event with cosmetic lines breaks in env.method call', () => {
      // Given
      const envMapMock = {};
      // This is the format in environment variables
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const expected = { instance3: { EdgeCase_FOO_BAR_BU: 'json' } };

      // When
      const result = Runner.filesReducer(envMapMock, filesMock[4]);

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('renderFile', () => {
    const fileMock = 'fileMock';
    const dataMock = Symbol('envMap') as any;

    it('should render the file', async () => {
      // When
      await Runner.renderFile(fileMock, dataMock);

      // Then
      expect(renderFile).toHaveBeenCalledTimes(1);
      expect(renderFile).toHaveBeenCalledWith(fileMock, dataMock);
    });

    it('should return the rendered file', async () => {
      // Given
      const expected = 'renderedFileMock';
      jest.mocked(renderFile).mockResolvedValue(expected);

      // When
      const result = await Runner.renderFile(fileMock, dataMock);

      // Then
      expect(result).toBe(expected);
    });
  });
});
