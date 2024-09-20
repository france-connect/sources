import React from 'react';

export const useApiGet = jest.fn(() => null);

export const ucfirst = jest.fn((v) => v);

export const sortBykey = jest.fn();

export const objectToFormData = jest.fn();

export const getAccessibleTitle = jest.fn();

export const useSafeContext = jest.fn();

export const useContentHeight = jest.fn(() => ({
  contentHeight: expect.any(Number),
  contentRef: React.createRef<HTMLDivElement>(),
}));

export const useSelectedItems = jest.fn(() => ({
  onSelectItem: jest.fn(),
  selected: [],
}));

export const useClipboard = jest.fn(() => ({
  onCopy: jest.fn(),
  onPaste: jest.fn(),
  value: expect.any(String),
}));

export const useScrollTo = jest.fn(() => ({
  scrollToTop: jest.fn(),
}));

export enum HttpStatusCode {
  FORBIDDEN = 403,
  CONFLICT = 409,
  UNAUTHORIZED = 401,
}

export enum HeadingTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum Strings {
  EMPTY_STRING = '',
  WHITE_SPACE = ' ',
  DASH = '-',
}
