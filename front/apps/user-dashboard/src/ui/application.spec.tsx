import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { ReactElement } from 'react';

import { AccountProvider, AccountProviderProps } from '@fc/account';
import { AxiosErrorCatcherProvider, AxiosErrorCatcherProviderProps } from '@fc/axios-error-catcher';
import { ApplicationLayout } from '@fc/dsfr';
import { AppContextProvider, AppContextProviderProps } from '@fc/state-management';

import { AppConfig } from '../config';
import { Application } from './application';

jest.mock('@fc/dsfr');
jest.mock('@fc/state-management');

describe('Application', () => {
  const AppContextProviderMock = mocked(AppContextProvider);
  const ApplicationLayoutMock = mocked(ApplicationLayout);
  const AccountProviderMock = mocked(AccountProvider);
  const AxiosErrorCatcherProviderMock = mocked(AxiosErrorCatcherProvider);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    AppContextProviderMock.mockImplementation(
      ({ children }: AppContextProviderProps) => children as ReactElement,
    );
    AccountProviderMock.mockImplementation(
      ({ children }: AccountProviderProps) => children as ReactElement,
    );
    AxiosErrorCatcherProviderMock.mockImplementation(
      ({ children }: AxiosErrorCatcherProviderProps) => children as ReactElement,
    );
    ApplicationLayoutMock.mockReturnValue(<div>ApplicationLayoutMock mockReturnValue</div>);
  });

  it('should render child component', () => {
    // Given
    const { getByText } = render(<Application />);
    // When
    const testValue = getByText('ApplicationLayoutMock mockReturnValue');
    // Then
    expect(testValue).toBeInTheDocument();
  });

  it('should call AccountProviderMock with config', () => {
    // Given
    render(<Application />);
    // Then
    expect(AccountProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: AppConfig.Account,
      }),
      {},
    );
  });

  it('should call AppContextProvider with config', () => {
    // Given
    render(<Application />);
    // Then
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
});
