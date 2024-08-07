import { renderHook } from '@testing-library/react';
import React from 'react';

import { useApiGet } from '@fc/common';

import { useReturnButton } from './use-return-button.hook';

jest.mock('@fc/common');

describe('useReturnButton', () => {
  it('should have return default values at first render', () => {
    // given
    const url = expect.any(String);

    // when
    const { result } = renderHook(() => useReturnButton(url));
    const { historyBackURL, serviceProviderName, showButton } = result.current;

    // then
    expect(historyBackURL).toBe('/');
    expect(serviceProviderName).toBe('');
    expect(showButton).toBeFalse();
  });

  it('should have called useApiGet with enpoint param', () => {
    // given
    const url = expect.any(String);

    // when
    renderHook(() => useReturnButton(url));

    // then
    expect(useApiGet).toHaveBeenCalledOnce();
    expect(useApiGet).toHaveBeenCalledWith({ endpoint: url });
  });

  it('should have returned default values at first render', () => {
    // given
    const url = expect.any(String);

    // when
    const { result } = renderHook(() => useReturnButton(url));

    // then
    expect(result.current).toStrictEqual({
      historyBackURL: '/',
      serviceProviderName: '',
      showButton: false,
    });
  });

  it('should have returned default values on api error', () => {
    // given
    const url = expect.any(String);
    jest.mocked(useApiGet).mockReturnValueOnce(null);

    // when
    const { result } = renderHook(() => useReturnButton(url));

    // then
    expect(result.current).toStrictEqual({
      historyBackURL: '/',
      serviceProviderName: '',
      showButton: false,
    });
  });

  it('should have returned parsed values on api response', () => {
    // given
    const url = expect.any(String);
    jest.mocked(useApiGet).mockReturnValueOnce({
      redirectURI: 'redirect-uri-mock',
      redirectURIQuery: { mock: 'mock' },
      spName: 'service-provider-name-mock',
    });

    // when
    const { result } = renderHook(() => useReturnButton(url));

    // then
    expect(result.current).toStrictEqual({
      historyBackURL: 'redirect-uri-mock?mock=mock',
      serviceProviderName: 'service-provider-name-mock',
      showButton: true,
    });
  });

  it('should have called setState once while multiple renders', () => {
    // given
    const url = expect.any(String);
    const setStateMock = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => ['unused-mocked-use-state-value', setStateMock]);
    jest.mocked(useApiGet).mockReturnValue({
      redirectURI: 'redirect-uri-mock',
      redirectURIQuery: { mock: 'mock' },
      spName: 'service-provider-name-mock',
    });

    // when
    const { rerender } = renderHook(() => useReturnButton(url));
    rerender();
    rerender();
    rerender();
    rerender();

    // then
    expect(useApiGet).toHaveBeenCalledTimes(5);
    expect(setStateMock).toHaveBeenCalledOnce();
    expect(setStateMock).toHaveBeenCalledWith({
      historyBackURL: 'redirect-uri-mock?mock=mock',
      serviceProviderName: 'service-provider-name-mock',
      showButton: true,
    });
  });
});
