import type { AxiosResponse } from 'axios';

import { ConfigService } from '@fc/config';
import { get } from '@fc/http-client';

import { loadFraudTracks } from './fraud-tracks.loader';

describe('loadFraudTracks', () => {
  // Given
  const tracksMock = [
    {
      idpName: 'any-acme-idpName-1',
      spName: 'any-acme-spName-1',
      trackId: 'any-acme-trackId-1',
    },
    {
      idpName: 'any-acme-idpName-2',
      spName: 'any-acme-spName-2',
      trackId: 'any-acme-trackId-2',
    },
  ];
  const fraudTracksMock = {
    meta: { code: 'any-connection-code-mock' },
    payload: tracksMock,
  };
  const responseMock = { data: fraudTracksMock } as unknown as AxiosResponse;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      apiRouteFraudGetTracks: 'acme-fraud-tracks-mock',
    });
    jest.mocked(get).mockResolvedValue(responseMock);
  });

  it('should retrieve the fraud config', async () => {
    // When
    await loadFraudTracks();

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Fraud');
  });

  it('should fetch the fraud tracks', async () => {
    // When
    await loadFraudTracks();

    // Then
    expect(get).toHaveBeenCalledExactlyOnceWith('acme-fraud-tracks-mock');
  });

  it('should return tracks and code', async () => {
    const result = await loadFraudTracks();

    // Then
    expect(result).toStrictEqual({
      data: {
        meta: { code: 'any-connection-code-mock' },
        payload: tracksMock,
      },
    });
  });

  it('should throw an error if the request fails', async () => {
    // Given
    const errorMock = new Error('Error fetching fraud tracks:');
    jest.mocked(get).mockRejectedValueOnce(errorMock);

    // Then
    await expect(() =>
      // When
      loadFraudTracks(),
    ).rejects.toEqual(errorMock);
  });
});
