import React from 'react';

export const ucfirst = jest.fn((v) => v);

export const sortByKey = jest.fn(() => jest.fn());

export const getAccessibleTitle = jest.fn();

/* ----------------------
 Hooks
---------------------- */
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

export const useScrollToElement = jest.fn(() => ({
  scrollToElement: jest.fn(),
}));

export enum HeadingTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum Strings {
  ASTERISK = '*',
  EMPTY_STRING = '',
  WHITE_SPACE = ' ',
  DASH = '-',
  SLASH = '/',
}

export enum ContentType {
  JSON = 'application/json',
  FORM_DATA = 'multipart/form-data',
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
}

export enum HttpMethods {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  PATCH = 'patch',
  DELETE = 'delete',
}

export enum EventTypes {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
