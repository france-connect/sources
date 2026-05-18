import { renderHook } from '@testing-library/react';
import type { Location } from 'react-router';
import { generatePath, useLoaderData, useLocation, useNavigate } from 'react-router';

import { ConfigService } from '@fc/config';

import { useServiceProvider } from './service-provider.hook';

describe('useServiceProvider', () => {
  // Given
  const navigateMock = jest.fn();
  const dataMock = {
    datapassRequestId: 'ABCDEF',
    datapassScopes: ['openid', 'email'],
    fcScopes: ['openid', 'email'],
    hasUnlinkedInstances: true,
    id: '123456',
    instances: [],
    name: 'Service Provider Name',
    organization: {
      id: '123456',
      name: 'Organization Name',
      siret: '12345678901234',
    },
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
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useLocation).mockReturnValue({ state: {} } as Location);
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(useLoaderData).mockReturnValue(dataResponseMock);
    jest.mocked(generatePath).mockReturnValue('/demande/ABCDEF');
  });

  it('should return the page data', () => {
    // When
    const { result } = renderHook(() => useServiceProvider());

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith('/demande/:id', { id: 'ABCDEF' });
    expect(result.current).toMatchObject({
      closeAlertHandler: expect.any(Function),
      datapassRequestId: 'ABCDEF',
      datapassScopes: ['openid', 'email'],
      fcScopes: ['openid', 'email'],
      habilitationLink: 'https://acme.com/demande/ABCDEF',
      hasUnlinkedInstances: true,
      id: '123456',
      name: 'Service Provider Name',
      organization: {
        id: '123456',
        name: 'Organization Name',
        siret: '12345678901234',
      },
      submitState: undefined,
    });
    expect(result.current.instances).toHaveLength(0);
  });

  it('should close alert by resetting router state', () => {
    // When
    const { result } = renderHook(() => useServiceProvider());
    result.current.closeAlertHandler();

    // Then
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('.', {
      replace: false,
      state: undefined,
    });
  });

  it('should return instances from API payload', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      payload: {
        ...dataMock,
        instances: [
          {
            createdAt: '2024-01-15T10:00:00.000Z',
            creator: {
              email: 'john.doe@example.com',
              firstname: 'John',
              id: 'creator-1',
              lastname: 'Doe',
            },
            currentVersion: {
              createdAt: '2024-01-15T10:00:00.000Z',
              data: {
                // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
                client_id: 'client-id-1',
                name: 'Instance 1',
              },
              id: 'version-id-1',
              publicationStatus: 'DRAFT',
              updatedAt: '2024-01-15T10:00:00.000Z',
            },
            environment: 'SANDBOX',
            id: 'instance-id-1',
            updatedAt: '2024-01-15T10:00:00.000Z',
          },
        ],
      },
    } as never);

    // When
    const { result } = renderHook(() => useServiceProvider());

    // Then
    expect(result.current.instances).toHaveLength(1);
    expect(result.current.instances[0]).toMatchObject({
      currentVersion: {
        data: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
          client_id: 'client-id-1',
          name: 'Instance 1',
        },
      },
      id: 'instance-id-1',
    });
  });
});
