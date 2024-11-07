export const useMediaQuery = jest.fn();

export const useDocumentTitle = jest.fn();

export const useLocalStorage = jest.fn(() => [expect.any(String), jest.fn(), jest.fn()]);

export const useToggle = jest.fn(() => [
  expect.any(Boolean),
  jest.fn().mockImplementation((v) => !v),
  jest.fn(),
]);

export const useCopyToClipboard = jest.fn(() => [expect.any(String), jest.fn()]);
