import { StylesProviderProps } from '@fc/styles';
import React, { ReactElement } from 'react';

export const useStylesQuery = jest.fn();

export const useStylesContext = jest.fn();

export const useStylesVariables = jest.fn();

export const StylesProvider = jest.fn(
  ({ children }: StylesProviderProps) => children as ReactElement,
);

export const StylesContext = React.createContext(expect.any(Object));

export enum Strings {
  DOUBLE_DASH = '--',
}
