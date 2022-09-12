export const useIsMounted = jest.fn(() => () => false);

export const useApiGet = jest.fn(() => null);

export const ucfirst = jest.fn((v) => v);

export const objectToFormData = jest.fn();

export const useLocalStorage = jest.fn(() => ({
  flush: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}));

export enum HttpStatusCode {
  UNAUTHORIZED = 401,
}
