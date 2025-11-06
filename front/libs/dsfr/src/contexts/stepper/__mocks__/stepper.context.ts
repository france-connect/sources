import type { ProviderExoticComponent, ProviderProps } from 'react';
import React from 'react';

export const StepperContext = React.createContext(expect.any(Object));

StepperContext.Provider = jest
  .fn()
  .mockImplementation(({ children }) => children) as unknown as ProviderExoticComponent<
  ProviderProps<unknown>
>;
