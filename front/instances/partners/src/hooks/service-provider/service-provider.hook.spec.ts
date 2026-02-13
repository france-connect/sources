import { renderHook } from '@testing-library/react';
import { generatePath, useLoaderData } from 'react-router';

import { ConfigService } from '@fc/config';

import { useServiceProvider } from './service-provider.hook';

describe('useServiceProvider', () => {
  // Given
  const dataMock = {
    datapassRequestId: 'ABCDEF',
    datapassScopes: ['openid', 'email'],
    fcScopes: ['openid', 'email'],
    id: '123456',
    name: 'Service Provider Name',
    organizationName: 'Organization Name',
  };
  const configMock = {
    datapassBaseUrl: 'https://acme.com',
    datapassHabilitationPathname: '/demande/:id',
  };
  const dataResponseMock = {
    payload: dataMock,
  } as never;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(useLoaderData).mockReturnValue(dataResponseMock);
    jest.mocked(generatePath).mockReturnValue('/demande/ABCDEF');
  });

  it('should return the page data', () => {
    // When
    const { result } = renderHook(() => useServiceProvider());

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith('/demande/:id', { id: 'ABCDEF' });
    expect(result.current).toStrictEqual({
      datapassRequestId: 'ABCDEF',
      datapassScopes: ['openid', 'email'],
      fcScopes: ['openid', 'email'],
      habilitationLink: 'https://acme.com/demande/ABCDEF',
      id: '123456',
      name: 'Service Provider Name',
      organizationName: 'Organization Name',
    });
  });
});
