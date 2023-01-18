import lget from 'lodash.get';
import { DependencyList, useCallback } from 'react';

import { useLocalStorage } from './use-local-storage.hook';

jest.mock('react');
jest.mock('lodash.get');

describe('useLocalStorage', () => {
  const useCallbackReturnValue = (input: unknown) => input;

  let getItemMock: jest.SpyInstance;
  let setItemMock: jest.SpyInstance;
  let removeItemMock: jest.SpyInstance;

  let jsonParseMock: jest.SpyInstance;
  let jsonStringifyMock: jest.SpyInstance;

  const jsonParseMockReturnValue = { foo: 'bar' };
  const jsonStringifyMockReturnValue = JSON.stringify(jsonParseMockReturnValue);

  const historyMock = {
    identityProvidersHistory: ['fia1', 'fia3'],
  };

  const localStorageItemMock = JSON.stringify(historyMock);

  const useCallbackMockImplementation = (cb: (...args: unknown[]) => unknown) => cb;

  beforeEach(() => {
    const localStorageProto = Object.getPrototypeOf(window.localStorage);

    getItemMock = jest.spyOn(localStorageProto, 'getItem').mockReturnValue(localStorageItemMock);
    setItemMock = jest.spyOn(localStorageProto, 'setItem');
    removeItemMock = jest.spyOn(localStorageProto, 'removeItem');

    jsonParseMock = jest.spyOn(JSON, 'parse').mockReturnValue(jsonParseMockReturnValue);
    jsonStringifyMock = jest.spyOn(JSON, 'stringify').mockReturnValue(jsonStringifyMockReturnValue);

    jest.mocked(useCallback).mockReturnValue(useCallbackReturnValue);
  });

  it('should wrap all methods with useCallback', () => {
    // Given
    const key = 'keyMock';

    // When
    const result = useLocalStorage(key);

    // Then
    expect(useCallback).toHaveBeenCalledTimes(3);

    expect(result).toHaveProperty('flush');
    expect(result.flush).toBe(useCallbackReturnValue);

    expect(result).toHaveProperty('get');
    expect(result.get).toBe(useCallbackReturnValue);

    expect(result).toHaveProperty('set');
    expect(result.set).toBe(useCallbackReturnValue);
  });

  describe('get', () => {
    beforeEach(() =>
      jest
        .mocked(useCallback)
        .mockImplementation(
          useCallbackMockImplementation as <T extends Function>(
            callback: T,
            deps: DependencyList,
          ) => T,
        ),
    );

    it('should call localStorage.getItem with key', () => {
      // Given
      const key = 'keyMock';
      const result = useLocalStorage(key);

      // When
      result.get();

      // Then
      expect(getItemMock).toHaveBeenCalledTimes(1);
      expect(getItemMock).toHaveBeenCalledWith(key);
    });

    it('should call JSON.parse with response from localStorage.getItem', () => {
      // Given
      const key = 'keyMock';
      const result = useLocalStorage(key);

      // When
      result.get();

      // Then
      expect(jsonParseMock).toHaveBeenCalledTimes(1);
      expect(jsonParseMock).toHaveBeenCalledWith(localStorageItemMock);
    });

    it('should call JSON.parse with "null" string when localStorage.getItem is falsey', () => {
      // Given
      getItemMock.mockReturnValueOnce(undefined);
      const key = 'keyMock';
      const result = useLocalStorage(key);

      // When
      result.get();

      // Then
      expect(jsonParseMock).toHaveBeenCalledTimes(1);
      expect(jsonParseMock).toHaveBeenCalledWith('null');
    });

    it('should use lodash.get if path argument is defined', () => {
      // Given
      const key = 'keyMock';
      const result = useLocalStorage(key);

      // When
      result.get('any-path');

      // Then
      expect(lget).toHaveBeenCalledTimes(1);
      expect(lget).toHaveBeenCalledWith(jsonParseMockReturnValue, 'any-path');
    });

    it('should return empty object if JSON.parse throws', () => {
      // Given
      const key = 'keyMock';
      const hook = useLocalStorage(key);
      jsonParseMock.mockImplementationOnce(() => {
        throw new Error();
      });

      // When
      const result = hook.get();

      // Then
      expect(result).toEqual({});
    });
  });

  describe('set', () => {
    beforeEach(() =>
      jest
        .mocked(useCallback)
        .mockImplementation(
          useCallbackMockImplementation as <T extends Function>(
            callback: T,
            deps: DependencyList,
          ) => T,
        ),
    );

    it('should call JSON.stringify with input value', () => {
      // Given
      const key = 'keyMock';
      const value = { foo: 'bar' };
      const hook = useLocalStorage(key);

      // When
      hook.set(value);

      // Then
      expect(jsonStringifyMock).toHaveBeenCalledTimes(1);
      expect(jsonStringifyMock).toHaveBeenCalledWith(value);
    });

    it('should call localStorage.setItem with result from JSON.stringify and input key', () => {
      // Given
      const key = 'keyMock';
      const value = { foo: 'bar' };
      const hook = useLocalStorage(key);

      // When
      hook.set(value);

      // Then
      expect(setItemMock).toHaveBeenCalledTimes(1);
      expect(setItemMock).toHaveBeenCalledWith(key, jsonStringifyMockReturnValue);
    });

    it('should throw if JSON.stringify throws', () => {
      // Given
      jsonStringifyMock.mockImplementationOnce(() => {
        throw new Error();
      });
      const key = 'keyMock';
      const value = { foo: 'bar' };
      const hook = useLocalStorage(key);

      // Then / When
      expect(() => hook.set(value)).toThrowWithMessage(
        Error,
        'Unable to write local storage value',
      );
    });

    it('should throw if localStorage.setItem throws', () => {
      // Given
      setItemMock.mockImplementationOnce(() => {
        throw new Error();
      });
      const key = 'keyMock';
      const value = { foo: 'bar' };
      const hook = useLocalStorage(key);

      // Then / When
      expect(() => hook.set(value)).toThrowWithMessage(
        Error,
        'Unable to write local storage value',
      );
    });
  });

  describe('flush', () => {
    beforeEach(() =>
      jest
        .mocked(useCallback)
        .mockImplementation(
          useCallbackMockImplementation as <T extends Function>(
            callback: T,
            deps: DependencyList,
          ) => T,
        ),
    );

    it('should call localStorage.removeItem() with input key', () => {
      // Given
      const key = 'keyMock';
      const hook = useLocalStorage(key);

      // When
      hook.flush();

      // Then
      expect(removeItemMock).toHaveBeenCalledTimes(1);
      expect(removeItemMock).toHaveBeenCalledWith(key);
    });
  });
});
