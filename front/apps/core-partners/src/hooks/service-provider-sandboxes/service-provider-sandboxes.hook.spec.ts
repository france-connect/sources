import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { useCleanupRouteState } from '@fc/routing';

import { CorePartnersOptions } from '../../enums';
import type { LocationWithSubmitStateInterface } from '../../interfaces';
import { useServiceProviderSandboxes } from './service-provider-sandboxes.hook';

describe('useServiceProviderSandboxes', () => {
  // Given
  const cleanupRouteStateMock = jest.fn();
  const spConfigurationDocUrlMock = 'https://example.com/sp-configuration-doc-mock';

  const configMock = {
    spConfigurationDocUrl: spConfigurationDocUrlMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(useLoaderData).mockReturnValue({
      payload: {
        linkableInstances: [],
      },
    });
    jest
      .mocked(useCleanupRouteState)
      .mockReturnValue({ cleanupRouteState: cleanupRouteStateMock, state: undefined });
  });

  it('should call ConfigService.get with ExternalUrls', () => {
    // When
    renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );
  });

  it('should call useLoaderData', () => {
    // When
    renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(useLoaderData).toHaveBeenCalledExactlyOnceWith();
  });

  it('should return spConfigurationDocUrl and hasUnlinkedInstances from loader data', () => {
    // When
    const { result } = renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(result.current).toEqual({
      cleanupRouteState: cleanupRouteStateMock,
      hasUnlinkedInstances: false,
      spConfigurationDocUrl: spConfigurationDocUrlMock,
      submitState: undefined,
    });
  });

  it('should return hasUnlinkedInstances as true when linkableInstances is not empty', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      payload: {
        linkableInstances: [{ id: 'instance-id-mock' }],
      },
    });

    // When
    const { result } = renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(result.current.hasUnlinkedInstances).toBeTrue();
  });

  it('should return submitState when route state is defined', () => {
    // Given
    const submitStateMock = {
      from: '/from-mock',
      message: 'Partners.instances.successLink',
      title: 'Partners.instances.successLink',
      type: MessageTypes.SUCCESS,
    } as unknown as LocationWithSubmitStateInterface;

    jest.mocked(useCleanupRouteState).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      state: submitStateMock,
    });

    // When
    const { result } = renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(result.current).toEqual({
      cleanupRouteState: cleanupRouteStateMock,
      hasUnlinkedInstances: false,
      spConfigurationDocUrl: spConfigurationDocUrlMock,
      submitState: submitStateMock,
    });
  });
});
