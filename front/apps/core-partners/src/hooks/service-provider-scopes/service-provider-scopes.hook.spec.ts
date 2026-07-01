import { renderHook } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import serviceProviderFixture from '../../__fixtures__/service-provider.fixture.json';
import { CorePartnersOptions } from '../../enums';
import type { ServiceProviderInterface } from '../../interfaces';
import { useServiceProviderScopes } from './service-provider-scopes.hook';

describe('useServiceProviderScopes', () => {
  // Given
  const datapassDocUrlMock = 'https://example.com/datapass-doc-mock';
  const scopeDocUrlMock = 'https://example.com/scope-doc-mock';

  const configMock = {
    datapassDocUrl: datapassDocUrlMock,
    scopeDocUrl: scopeDocUrlMock,
  };

  const serviceProviderMock = serviceProviderFixture as ServiceProviderInterface;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
  });

  it('should call ConfigService.get with ExternalUrls', () => {
    // When
    renderHook(() =>
      useServiceProviderScopes(serviceProviderMock.datapassScopes, serviceProviderMock.fcScopes),
    );

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );
  });

  it('should return datapassDocUrl and scopeDocUrl from config', () => {
    // When
    const { result } = renderHook(() =>
      useServiceProviderScopes(serviceProviderMock.datapassScopes, serviceProviderMock.fcScopes),
    );

    // Then
    expect(result.current.datapassDocUrl).toBe(datapassDocUrlMock);
    expect(result.current.scopeDocUrl).toBe(scopeDocUrlMock);
  });

  it('should return tabLists with datapass and fc scopes', () => {
    // When
    const { result } = renderHook(() =>
      useServiceProviderScopes(serviceProviderMock.datapassScopes, serviceProviderMock.fcScopes),
    );

    // Then
    expect(result.current.tabLists).toStrictEqual([
      {
        id: 'datapass',
        scopes: serviceProviderMock.datapassScopes,
      },
      {
        id: 'fc',
        scopes: serviceProviderMock.fcScopes,
      },
    ]);
  });
});
