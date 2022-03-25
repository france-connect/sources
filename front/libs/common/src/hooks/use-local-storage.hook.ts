import lget from 'lodash.get';
import { useCallback } from 'react';

import { LocalStorageInterface } from '../interfaces';

export const useLocalStorage = (key: string) => {
  const get = useCallback(
    (path?: string): LocalStorageInterface | unknown => {
      const json = localStorage.getItem(key);
      let object;
      try {
        object = JSON.parse(json || 'null');
      } catch (error) {
        return {};
      }
      const result = object && path ? lget(object, path) : object;
      return result;
    },
    [key],
  );

  const set = useCallback(
    (value: LocalStorageInterface) => {
      try {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
      } catch (err) {
        throw new Error('Unable to write local storage value');
      }
    },
    [key],
  );

  const flush = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { flush, get, set };
};
