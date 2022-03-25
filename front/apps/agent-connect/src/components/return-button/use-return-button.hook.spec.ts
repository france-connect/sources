import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';

import { useReturnButton } from './use-return-button.hook';

jest.mock('@fc/common');
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useState: jest.fn(),
  };
});

describe('useReturnButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mocked(useState).mockImplementation(jest.requireActual('react').useState);
  });

  it('should have return default values at first render', () => {
    // when
    const { result } = renderHook(() => useReturnButton());
    const { historyBackURL, serviceProviderName, showButton } = result.current;
    // then
    expect(historyBackURL).toEqual('/');
    expect(serviceProviderName).toEqual('');
    expect(showButton).toBe(false);
  });

  it('should have called useApiGet with enpoint param', () => {
    // when
    renderHook(() => useReturnButton());
    // then
    expect(useApiGet).toHaveBeenCalledTimes(1);
    expect(useApiGet).toHaveBeenCalledWith({ endpoint: '/api/v2/history-back-url' });
  });

  it('should have returned default values at first render', () => {
    // when
    const { result } = renderHook(() => useReturnButton());
    // then
    expect(result.current).toStrictEqual({
      historyBackURL: '/',
      serviceProviderName: '',
      showButton: false,
    });
  });

  it('should have returned default values on api error', () => {
    // given
    mocked(useApiGet).mockReturnValueOnce(null);
    // when
    const { result } = renderHook(() => useReturnButton());
    // then
    expect(result.current).toStrictEqual({
      historyBackURL: '/',
      serviceProviderName: '',
      showButton: false,
    });
  });

  it('should have returned parsed values on api response', () => {
    // given
    mocked(useApiGet).mockReturnValueOnce({
      redirectURI: 'redirect-uri-mock',
      redirectURIQuery: { mock: 'mock' },
      spName: 'service-provider-name-mock',
    });
    // when
    const { result } = renderHook(() => useReturnButton());
    // then
    expect(result.current).toStrictEqual({
      historyBackURL: 'redirect-uri-mock?mock=mock',
      serviceProviderName: 'service-provider-name-mock',
      showButton: true,
    });
  });

  it('should have called setState once while multiple renders', () => {
    // given
    const setStateMock = jest.fn();
    mocked(useState).mockImplementation(() => ['unused-mocked-use-state-value', setStateMock]);
    mocked(useApiGet).mockReturnValue({
      redirectURI: 'redirect-uri-mock',
      redirectURIQuery: { mock: 'mock' },
      spName: 'service-provider-name-mock',
    });
    // when
    const { rerender } = renderHook(() => useReturnButton());
    rerender();
    rerender();
    rerender();
    rerender();
    // then
    expect(useApiGet).toHaveBeenCalledTimes(5);
    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith({
      historyBackURL: 'redirect-uri-mock?mock=mock',
      serviceProviderName: 'service-provider-name-mock',
      showButton: true,
    });
  });
});
