import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { useServiceProviders } from './service-providers.hook';

describe('useServiceProviders', () => {
  // Given
  const itemMock1 = {
    authorizedScopes: ['openid', 'given_name', 'family_name', 'email'],
    createdAt: '2022-02-22T23:00:00.000Z',
    datapassRequestId: 'DP2024001',
    id: 'd7d36b81-0b68-4c26-a399-854848164f29',
    name: "Groupement de coopération sanitaire Système d'information santé Auvergne-Rhône-Alpes",
    organizationName: 'Ministère de la Transition Écologique',
    updatedAt: '2022-05-02T22:00:00.000Z',
  };
  const itemMock2 = {
    authorizedScopes: ['openid', 'given_name', 'family_name', 'email'],
    createdAt: '2022-02-22T23:00:00.000Z',
    datapassRequestId: 'DP2024001',
    id: 'b43628dc-83a8-4bb6-8c0b-0234b7aa8e14',
    name: 'Espace Numerique Maritime - Espace marin',
    organizationName: 'Ministère de la Transition Écologique',
    updatedAt: '2022-05-02T22:00:00.000Z',
  };

  beforeEach(() => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({ payload: [itemMock1, itemMock2] });
  });

  it('should return items', () => {
    // When
    const { result } = renderHook(() => useServiceProviders());

    // Then
    expect(result.current).toEqual({
      hasItems: true,
      items: [itemMock1, itemMock2],
    });
  });

  it('should return hasItems as true when payload has items', () => {
    // When
    const { result } = renderHook(() => useServiceProviders());

    // Then
    expect(result.current).toEqual({
      hasItems: true,
      items: [itemMock1, itemMock2],
    });
  });

  it('should return hasItems as false when payload has no items', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({ payload: [] });

    // When
    const { result } = renderHook(() => useServiceProviders());

    // Then
    expect(result.current).toEqual({
      hasItems: false,
      items: [],
    });
  });
});
