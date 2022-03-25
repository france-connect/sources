import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from './use-api-get.hook';

describe('useApiGet', () => {
  const axiosGetMock = mocked(axios.get);
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    axiosGetMock.mockResolvedValue({ data: 'any-data-response' });
  });

  it('should have return default state at first render', async () => {
    // when
    const { result, waitForNextUpdate } = renderHook(() => useApiGet({ endpoint: 'any-url' }));
    // then
    await waitForNextUpdate();
    expect(result.all[0]).toBeUndefined();
  });

  it('should have called axios.get at first render only', async () => {
    // when
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      useApiGet({ endpoint: 'any-url' }),
    );
    // @NOTE excessive renders only for tests purpose
    rerender();
    rerender();
    rerender();
    rerender();
    // then
    await waitForNextUpdate();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('any-url');
    expect(result.current).toStrictEqual('any-data-response');
  });

  it('should have called optionnal callback with api response', async () => {
    // given
    const callbackMock = jest.fn();
    // when
    const { waitForNextUpdate } = renderHook(() =>
      useApiGet({ endpoint: 'any-url' }, callbackMock),
    );
    // then
    await waitForNextUpdate();
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith('any-data-response');
  });
});
