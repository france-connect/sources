import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { mocked } from 'jest-mock';

import { useApiGet } from './use-api-get.hook';

describe('useApiGet', () => {
  const axiosGetMock = mocked(axios.get);
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    axiosGetMock.mockResolvedValue({ data: 'any-data-response' });
  });

  it('should have return default state at first render', async () => {
    axiosGetMock.mockResolvedValueOnce(undefined);

    // when
    const { result } = renderHook(() => useApiGet({ endpoint: 'any-url' }));

    // then
    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should have called axios.get at first render only', async () => {
    // when
    const { rerender, result } = renderHook(() => useApiGet({ endpoint: 'any-url' }));
    // @NOTE excessive renders only for tests purpose
    rerender();
    rerender();
    rerender();
    rerender();

    // then
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('any-url');
      expect(result.current).toStrictEqual('any-data-response');
    });
  });

  it('should have called optionnal callback with api response', async () => {
    // given
    const callbackMock = jest.fn();

    // when
    renderHook(() => useApiGet({ endpoint: 'any-url' }, callbackMock));

    // then
    await waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith('any-data-response');
    });
  });
});
