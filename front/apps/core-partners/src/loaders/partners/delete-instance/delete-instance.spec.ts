import { generatePath } from 'react-router';

import { ConfigService } from '@fc/config';
import { deleteWithAuthHandling } from '@fc/http-client';

import { deleteInstance } from './delete-instance';

describe('deleteInstance', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        instance: 'any-endpoints-uri-mock/:instanceId',
      },
    } as never);
    jest.mocked(generatePath).mockReturnValue('any-endpoints-uri-mock/1234');
  });

  it('should call ConfigService.get with the partners config name', async () => {
    // When
    await deleteInstance('1234');

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Partners');
  });

  it('should call generatePath with the instance endpoint and the instance identifier', async () => {
    // When
    await deleteInstance('1234');

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith('any-endpoints-uri-mock/:instanceId', {
      instanceId: '1234',
    });
  });

  it('should call deleteWithAuthHandling with the generated url', async () => {
    // When
    await deleteInstance('1234');

    // Then
    expect(deleteWithAuthHandling).toHaveBeenCalledExactlyOnceWith('any-endpoints-uri-mock/1234');
  });

  it('should rethrow API errors', async () => {
    // Given
    const errorMock = { status: 500 };
    jest.mocked(deleteWithAuthHandling).mockRejectedValueOnce(errorMock);

    // When / Then
    await expect(deleteInstance('1234')).rejects.toBe(errorMock);
  });
});
