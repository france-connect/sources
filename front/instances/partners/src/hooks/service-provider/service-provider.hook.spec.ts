import { renderHook } from '@testing-library/react';
import { useRouteLoaderData } from 'react-router';

import serviceProviderFixture from '../../__fixtures__/service-provider.fixture.json';
import serviceProviderPermissionsFixture from '../../__fixtures__/service-provider-permissions.fixture.json';
import { useServiceProvider } from './service-provider.hook';

describe('useServiceProvider', () => {
  // Given
  const serviceProviderMock = serviceProviderFixture;
  const permissionsMock = serviceProviderPermissionsFixture;

  beforeEach(() => {
    // Given
    jest.mocked(useRouteLoaderData).mockReturnValue({
      meta: { permissions: permissionsMock },
      payload: serviceProviderMock,
    });
  });

  it('should call useRouteLoaderData with service-provider route id', () => {
    // When
    renderHook(() => useServiceProvider());

    // Then
    expect(useRouteLoaderData).toHaveBeenCalledExactlyOnceWith('service-provider');
  });

  it('should return permissions and serviceProvider from loader data', () => {
    // When
    const { result } = renderHook(() => useServiceProvider());

    // Then
    expect(result.current).toEqual({
      permissions: permissionsMock,
      serviceProvider: serviceProviderMock,
    });
  });
});
