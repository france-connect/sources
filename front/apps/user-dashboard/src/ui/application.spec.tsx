import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { mocked } from 'ts-jest/utils';

import { ApplicationLayout } from '@fc/dsfr';
import { UserInfosProvider, UserInfosProviderProps } from '@fc/oidc-client';
import { AppContextProvider, AppContextProviderProps } from '@fc/state-management';

import { AppConfig } from '../config';
import { Application } from './application';

jest.mock('@fc/dsfr');
jest.mock('@fc/state-management');

describe('Application', () => {
  const AppContextProviderMock = mocked(AppContextProvider);
  const ApplicationLayoutMock = mocked(ApplicationLayout);
  const UserInfosProviderMock = mocked(UserInfosProvider);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    AppContextProviderMock.mockImplementation(
      ({ children }: AppContextProviderProps) => children as ReactElement,
    );
    UserInfosProviderMock.mockImplementation(
      ({ children }: UserInfosProviderProps) => children as ReactElement,
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

  it('should call UserInfosProviderMock with config', () => {
    // Given
    render(<Application />);
    // Then
    expect(UserInfosProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userInfosEndpoint: AppConfig.OidcClient.endpoints.getUserInfos,
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
});
