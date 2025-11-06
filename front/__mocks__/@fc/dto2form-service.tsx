import type { PropsWithChildren, ReactElement } from 'react';

export enum Options {
  CONFIG_NAME = 'Dto2FormService',
}

export const Dto2FormServiceProvider = jest.fn(
  ({ children }: PropsWithChildren) => children as ReactElement,
);

export const useDto2FormService = jest.fn(() => jest.fn());

export const useDto2FormSubmitHandler = jest.fn(() => jest.fn());

export const dto2FormServiceCommit = jest.fn();

export const parseInitialValues = jest.fn();
