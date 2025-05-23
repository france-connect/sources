import { existsSync, readFileSync } from 'fs';

import { parseBoolean, parseJsonProperty } from '@fc/common';

import { ConfigParser } from './config-parser';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  parseBoolean: jest.fn(),
  parseJsonProperty: jest.fn(),
}));

describe('ConfigParser', () => {
  let reader: ConfigParser;

  const configMock = {
    'someprefix/foo': 'bar',
    'someprefix/bar': '{"fizz":"buzz"}',
    'someprefix/baz': 'true',
    'someprefix/emptyString': '',
    'someprefix/woo': '42',
    'someprefix/zin': '/some/path/to/read.txt',
  };
  const prefixMock = 'someprefix';
  const separatorMock = '/';

  const parseBooleanMock = jest.mocked(parseBoolean);
  const parseJsonPropertyMock = jest.mocked(parseJsonProperty);
  const readFileSyncMock = jest.mocked(readFileSync);
  const existsSyncMock = jest.mocked(existsSync);

  beforeEach(() => {
    reader = new ConfigParser(configMock, prefixMock, separatorMock);

    jest.resetAllMocks();

    parseBooleanMock.mockReturnValue(true);
    parseJsonPropertyMock.mockReturnValue({ fizz: 'baz' });
  });

  describe('constructor', () => {
    it('should use default separator', () => {
      // Given
      const config = {};
      const prefix = 'test';
      // When
      const result = new ConfigParser(config, prefix);
      // Then
      expect(result).toHaveProperty('separator');
      expect(result['separator']).toBe('_');
    });
    it('should use given separator', () => {
      // Given
      const config = {};
      const prefix = 'test';
      const separator = '#';
      // When
      const result = new ConfigParser(config, prefix, separator);
      // Then
      expect(result).toHaveProperty('separator');
      expect(result['separator']).toBe('#');
    });
  });

  describe('getFullPath', () => {
    it('should return prefixed path', () => {
      // Given
      const path = 'blah';
      // When
      const result = reader['getFullPath'](path);
      // Then
      expect(result).toBe('someprefix/blah');
    });
  });

  describe('boolean', () => {
    it('should execute parseBoolean with given value', () => {
      // Given
      const path = 'baz';
      // When
      reader.boolean(path);
      // Then
      expect(parseBooleanMock).toHaveBeenCalledTimes(1);
      expect(parseBooleanMock).toHaveBeenCalledWith(
        configMock['someprefix/baz'],
      );
    });

    it('should return result from parseBoolean', () => {
      // Given
      const path = 'baz';
      const parseBooleanMockReturnValue = Symbol('true');
      parseBooleanMock.mockReturnValue(
        parseBooleanMockReturnValue as unknown as boolean,
      );
      // When
      const result = reader.boolean(path);
      // Then
      expect(result).toBe(parseBooleanMockReturnValue);
    });
  });

  describe('json', () => {
    it('should execute parseJsonProperty with given value', () => {
      // Given
      const path = 'baz';
      // When
      reader.json(path);
      // Then
      expect(parseJsonPropertyMock).toHaveBeenCalledTimes(1);
      expect(parseJsonPropertyMock).toHaveBeenCalledWith(
        configMock,
        'someprefix/baz',
      );
    });

    it('should return result from parseJsonProperty', () => {
      // Given
      const path = 'baz';
      const parseJsonPropertyMockReturnValue = Symbol('someobject');
      parseJsonPropertyMock.mockReturnValue(
        parseJsonPropertyMockReturnValue as unknown as object,
      );
      // When
      const result = reader.json(path);
      // Then
      expect(result).toBe(parseJsonPropertyMockReturnValue);
    });

    it('should return undefined', () => {
      // Given
      const path = 'barbar';
      // When
      const result = reader.json(path);
      // Then
      expect(result).toBe(undefined);
    });
  });

  describe('string', () => {
    it('should return simple variable', () => {
      // Given
      const path = 'foo';
      // When
      const result = reader.string(path);
      // Then
      expect(result).toBe('bar');
    });

    it('should return simple variable even if undefinedIfEmpty is true', () => {
      // Given
      const path = 'foo';
      // When
      const result = reader.string(path, { undefinedIfEmpty: true });
      // Then
      expect(result).toBe('bar');
    });

    it('should return empty string if undefinedIfEmpty is false', () => {
      // Given
      const path = 'emptyString';
      // When
      const result = reader.string(path, { undefinedIfEmpty: false });
      // Then
      expect(result).toBe('');
    });

    it('should return undefined if undefinedIfEmpty is true', () => {
      // Given
      const path = 'emptyString';
      // When
      const result = reader.string(path, { undefinedIfEmpty: true });
      // Then
      expect(result).toBe(undefined);
    });
  });

  describe('number', () => {
    it('should return a number', () => {
      // Given
      const path = 'woo';
      // When
      const result = reader.number(path);
      // Then
      expect(typeof result).toBe('number');
      expect(result).toBe(42);
    });
  });

  describe('exist', () => {
    it('should return true', () => {
      // Given
      const path = 'woo';
      // When
      const result = reader['exist'](path);
      // Then
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should return false', () => {
      // Given
      const path = 'woowoo';
      // When
      const result = reader['exist'](path);
      // Then
      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });
  });

  describe('file', () => {
    const fileContentMock = 'fileContentMockValue';
    beforeEach(() => {
      readFileSyncMock.mockReturnValue(fileContentMock);
    });
    it('should call readfilesync with given path', () => {
      // Given
      const path = 'zin';
      existsSyncMock.mockReturnValueOnce(true);
      // When
      const result = reader.file(path);
      // Then
      expect(existsSyncMock).toHaveBeenCalledTimes(1);
      expect(existsSyncMock).toHaveBeenCalledWith('/some/path/to/read.txt');
      expect(readFileSyncMock).toHaveBeenCalledTimes(1);
      expect(readFileSyncMock).toHaveBeenCalledWith(
        '/some/path/to/read.txt',
        'utf-8',
      );
      expect(result).toBe(fileContentMock);
    });
    it('should return result null if file is missing and optional', () => {
      // Given
      const path = 'zin';
      existsSyncMock.mockReturnValueOnce(false);
      // When
      const result = reader.file(path, { optional: true });
      // Then
      expect(result).toBe(null);
    });

    it('should throw an error if file is missing but not optional', () => {
      // Given
      const path = 'zin';
      existsSyncMock.mockReturnValueOnce(false);

      expect(
        // When
        () => reader.file(path, { optional: false }),
        // Then
      ).toThrow('file at path /some/path/to/read.txt is missing');
    });
  });

  describe('root', () => {
    // Given
    const data = {
      FOO: 'FOO root value',
      // Follow env variables declaration convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      MyNamespace_FOO: 'FOO namespace value',
    };
    const namespace = 'MyNamespace';

    it('should return a new instance of ConfigParser', () => {
      // When
      const result = reader.root;
      // Then
      expect(result).toBeInstanceOf(ConfigParser);
    });

    it('should allow to retrieve values from the namespace', () => {
      // Given
      const parser = new ConfigParser(data, namespace);

      // When
      const result = parser.string('FOO');

      // Then
      expect(result).toBe('FOO namespace value');
    });

    it('should allow to retrieve values from the root', () => {
      // Given
      const parser = new ConfigParser(data, namespace);

      // When
      const result = parser.root.string('FOO');

      // Then
      expect(result).toBe('FOO root value');
    });
  });
});
