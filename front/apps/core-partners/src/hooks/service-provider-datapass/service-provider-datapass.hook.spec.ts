import { renderHook } from '@testing-library/react';
import { generatePath } from 'react-router';

import { ConfigService } from '@fc/config';

import { CorePartnersOptions } from '../../enums';
import { useServiceProviderDatapass } from './service-provider-datapass.hook';

describe('useServiceProviderHabilitation', () => {
  // Given
  const datapassRequestIdMock = 'datapass-request-id-mock';
  const configMock = {
    datapassBaseUrl: 'https://acme.com',
    datapassHabilitationPathname: '/demande/:id',
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(generatePath).mockReturnValue('/demande/datapass-request-id-mock');
  });

  it('should call ConfigService.get with ExternalUrls', () => {
    // When
    renderHook(() => useServiceProviderDatapass(datapassRequestIdMock));

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );
  });

  it('should call generatePath with datapassHabilitationPathname and datapassRequestId', () => {
    // When
    renderHook(() => useServiceProviderDatapass(datapassRequestIdMock));

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith('/demande/:id', {
      id: datapassRequestIdMock,
    });
  });

  it('should return habilitationLink', () => {
    // When
    const { result } = renderHook(() => useServiceProviderDatapass(datapassRequestIdMock));

    // Then
    expect(result.current).toStrictEqual({
      habilitationLink: 'https://acme.com/demande/datapass-request-id-mock',
    });
  });
});
