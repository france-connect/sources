import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React, { ReactElement } from 'react';

import { AccountProvider } from '@fc/account';
import { ConfigService } from '@fc/config';
import { ApplicationLayout } from '@fc/dsfr';
import { ErrorBoundaryComponent } from '@fc/error-boundary';
import { I18nService } from '@fc/i18n';
import { AppContextProvider, AppContextProviderProps, StoreProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { routes } from '../config/routes';
import translations from '../i18n/fr.json';
import { Application, onErrorHandler } from './application';

jest.mock('@fc/dsfr');
jest.mock('@fc/i18n');
jest.mock('@fc/config');
jest.mock('@fc/account');
jest.mock('@fc/routing');
jest.mock('@fc/error-boundary');
jest.mock('@fc/state-management');

describe('HomePage', () => {
  const StoreProviderMock = mocked(StoreProvider);
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
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
    onErrorHandler(new Error('Randow Banana Error'));
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
    expect(ErrorBoundaryComponent).toHaveBeenCalledTimes(2);
    expect(ErrorBoundaryComponent).toHaveBeenCalledWith(
      expect.objectContaining({ onError: expect.any(Function) }),
      {},
    );
  });

  it('should call AppContextProvider with config', () => {
    // when
    render(<Application />);

    // Then
    expect(AppContextProviderMock).toHaveBeenCalledTimes(2);
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
    expect(AccountProvider).toHaveBeenCalledTimes(2);
    expect(AccountProvider).toHaveBeenCalledWith(
      expect.objectContaining({ config: AppConfig.Account }),
      {},
    );
  });

  it('should call ApplicationLayout with props', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationLayout).toHaveBeenCalledTimes(2);
    expect(ApplicationLayout).toHaveBeenCalledWith(
      expect.objectContaining({ config: AppConfig.Layout, routes }),
      {},
    );
  });

  it('should call StoreProvider, with params', () => {
    // when
    render(<Application />);

    // then
    expect(StoreProviderMock).toHaveBeenCalledTimes(2);
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
});
