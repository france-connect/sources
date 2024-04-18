import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import type { AccountProviderProps } from '@fc/account';
import { AccountProvider } from '@fc/account';
import type { AxiosErrorCatcherProviderProps } from '@fc/axios-error-catcher';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import type { AppContextProviderProps } from '@fc/state-management';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('@fc/dsfr');
jest.mock('@fc/state-management');

// given
jest.mock('./application.routes', () => ({
  ApplicationRoutes: jest.fn(() => <div>ApplicationRoutes</div>),
}));

describe('Application', () => {
  const AppContextProviderMock = jest.mocked(AppContextProvider);
  const AccountProviderMock = jest.mocked(AccountProvider);
  const AxiosErrorCatcherProviderMock = jest.mocked(AxiosErrorCatcherProvider);
  const ApplicationRoutesMock = jest.mocked(ApplicationRoutes);

  beforeEach(() => {
    AppContextProviderMock.mockImplementation(
      ({ children }: AppContextProviderProps) => children as ReactElement,
    );
    AccountProviderMock.mockImplementation(
      ({ children }: AccountProviderProps) => children as ReactElement,
    );
    AxiosErrorCatcherProviderMock.mockImplementation(
      ({ children }: AxiosErrorCatcherProviderProps) => children as ReactElement,
    );
  });

  it('should call AccountProviderMock with config', () => {
    // when
    render(<Application />);

    // then
    expect(AccountProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: AppConfig.Account,
      }),
      {},
    );
  });

  it('should call AppContextProvider with config', () => {
    // when
    render(<Application />);

    // then
    expect(AppContextProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { config: AppConfig },
      }),
      {},
    );
  });

  it('should call AxiosErrorCatcherProvider', () => {
    // When
    render(<Application />);
    // Then
    expect(AxiosErrorCatcherProviderMock).toHaveBeenCalled();
  });

  it('should call ApplicationRoutes', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationRoutesMock).toHaveBeenCalledOnce();
  });
});
