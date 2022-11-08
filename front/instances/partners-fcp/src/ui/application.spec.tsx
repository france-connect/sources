import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React, { ReactElement } from 'react';

import { AccountProvider } from '@fc/account';
import { ConfigService } from '@fc/config';
import { ErrorBoundaryComponent } from '@fc/error-boundary';
import { I18nService } from '@fc/i18n';
import { AppContextProvider, AppContextProviderProps, StoreProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { Application, onErrorHandler } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('@fc/dsfr');
jest.mock('@fc/i18n');
jest.mock('@fc/config');
jest.mock('@fc/account');
jest.mock('@fc/routing');
jest.mock('@fc/error-boundary');
jest.mock('@fc/state-management');

// given
jest.mock('./application.routes', () => ({
  ApplicationRoutes: jest.fn(() => <div>ApplicationRoutes</div>),
}));

describe('Application', () => {
  const StoreProviderMock = mocked(StoreProvider);
  const ApplicationRoutesMock = mocked(ApplicationRoutes);
  const AppContextProviderMock = mocked(AppContextProvider);

  beforeEach(() => {
    jest.clearAllMocks();

    StoreProviderMock.mockImplementation(({ children }) => children);

    AppContextProviderMock.mockImplementation(
      ({ children }: AppContextProviderProps) => children as ReactElement,
    );

    mocked(ConfigService.get).mockReturnValueOnce({
      persistKey: 'persistKey-mock',
    });
  });

  it('@TODO only for development purpose test if console mock has been called', () => {
    // @TODO to be removed when FCA/FCP implementation is done
    // given
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation();

    // when
    onErrorHandler(new Error('Randow Banana Error'));

    // then
    expect(consoleMock).toHaveBeenCalled();
  });

  it('should call I18nService.initialize with params', () => {
    // when
    render(<Application />);

    // then
    expect(I18nService.initialize).toHaveBeenCalledTimes(1);
    expect(I18nService.initialize).toHaveBeenCalledWith('fr', translations);
  });

  it('should call ServiceConfig.initialize, with AppConfig param', () => {
    // when
    render(<Application />);

    // then
    expect(ConfigService.initialize).toHaveBeenCalledTimes(1);
    expect(ConfigService.initialize).toHaveBeenCalledWith(AppConfig);
  });

  it('should call ServiceConfig.get, with param', () => {
    // when
    render(<Application />);

    // then
    expect(ConfigService.get).toHaveBeenCalledTimes(1);
    expect(ConfigService.get).toHaveBeenCalledWith('Application');
  });

  it('should call ErrorBoundaryComponent with props', () => {
    // when
    render(<Application />);

    // then
    expect(ErrorBoundaryComponent).toHaveBeenCalledTimes(1);
    expect(ErrorBoundaryComponent).toHaveBeenCalledWith(
      expect.objectContaining({ onError: expect.any(Function) }),
      {},
    );
  });

  it('should call AppContextProvider with config', () => {
    // when
    render(<Application />);

    // Then
    expect(AppContextProviderMock).toHaveBeenCalledTimes(1);
    expect(AppContextProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { config: AppConfig },
      }),
      {},
    );
  });

  it('should call AccountProvider with props', () => {
    // when
    render(<Application />);

    // then
    expect(AccountProvider).toHaveBeenCalledTimes(1);
    expect(AccountProvider).toHaveBeenCalledWith(
      expect.objectContaining({ config: AppConfig.Account }),
      {},
    );
  });

  it('should call StoreProvider, with params', () => {
    // when
    render(<Application />);

    // then
    expect(StoreProviderMock).toHaveBeenCalledTimes(1);
    expect(StoreProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.anything(),
        debugMode: expect.any(Boolean),
        middlewares: [],
        persistKey: 'persistKey-mock',
        reducers: {},
        states: expect.any(Object),
      }),
      {},
    );
  });

  it('should call ApplicationRoutes', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationRoutesMock).toHaveBeenCalledTimes(1);
  });
});
