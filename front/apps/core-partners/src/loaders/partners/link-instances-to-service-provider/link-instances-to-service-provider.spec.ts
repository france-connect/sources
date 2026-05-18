import { ConfigService } from '@fc/config';
import { post } from '@fc/http-client';

import { linkInstancesToServiceProvider } from './link-instances-to-service-provider';

describe('linkInstancesToServiceProvider', () => {
  const payloadMock = {
    instanceIds: ['instance-1', 'instance-2'],
    serviceProviderId: 'service-provider-1',
  };

  it('should post instance link payload when endpoint is configured', async () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: {
        linkInstances: '/api/link-instances',
      },
    } as never);

    // When
    await linkInstancesToServiceProvider(payloadMock);

    // Then
    expect(post).toHaveBeenCalledExactlyOnceWith('/api/link-instances', payloadMock);
  });

  it('should rethrow API errors', async () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: {
        linkInstances: '/api/link-instances',
      },
    } as never);
    const errorMock = { status: 500 };
    jest.mocked(post).mockRejectedValueOnce(errorMock);

    // When / Then
    await expect(linkInstancesToServiceProvider(payloadMock)).rejects.toBe(errorMock);
  });
});
