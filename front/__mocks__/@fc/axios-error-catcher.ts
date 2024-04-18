import React from 'react';

export const AxiosErrorCatcherProvider = jest.fn();

export const AxiosErrorCatcherContext = React.createContext(expect.any(Object));
