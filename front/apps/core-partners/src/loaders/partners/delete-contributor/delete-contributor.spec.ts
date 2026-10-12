import { generatePath } from 'react-router';

import { ConfigService } from '@fc/config';
import { deleteWithAuthHandling } from '@fc/http-client';

import { deleteContributor } from './delete-contributor';

describe('deleteContributor', () => {
  const serviceProviderIdMock = 'any-service-provider-id-mock';
  const accountIdMock = 'any-account-id-mock';

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        serviceProviderContributors: 'any-endpoints-uri-mock/:serviceProviderId/contributors',
      },
    } as never);
    jest.mocked(generatePath).mockReturnValue('any-endpoints-uri-mock/1234/contributors');
  });

  it('should call ConfigService.get with the partners config name', async () => {
    // When
    await deleteContributor(serviceProviderIdMock, accountIdMock);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Partners');
  });

  it('should call generatePath with the contributors endpoint and the service provider identifier', async () => {
    // When
    await deleteContributor(serviceProviderIdMock, accountIdMock);

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith(
      'any-endpoints-uri-mock/:serviceProviderId/contributors',
      { serviceProviderId: serviceProviderIdMock },
    );
  });

  it('should call deleteWithAuthHandling with the generated url and the account identifier in the body', async () => {
    // When
    await deleteContributor(serviceProviderIdMock, accountIdMock);

    // Then
    expect(deleteWithAuthHandling).toHaveBeenCalledExactlyOnceWith(
      'any-endpoints-uri-mock/1234/contributors',
      {
        accountIds: [accountIdMock],
      },
    );
  });

  it('should rethrow API errors', async () => {
    // Given
    const errorMock = { status: 500 };
    jest.mocked(deleteWithAuthHandling).mockRejectedValueOnce(errorMock);

    // When / Then
    await expect(deleteContributor(serviceProviderIdMock, accountIdMock)).rejects.toBe(errorMock);
  });
});
