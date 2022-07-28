import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { Location } from 'history';
import { useLocation } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import { TracksConfig } from '../../interfaces';
import { DEFAULT_OFFSET, DEFAULT_SIZE, usePaginatedTracks } from './use-paginated-tracks.hook';

jest.mock('axios');

describe('usePaginatedTracks', () => {
  // given
  const options = { API_ROUTE_TRACKS: 'tracks-route' } as TracksConfig;
  const tracksMock = ['tracks1', 'tracks2'];
  const getTracksResponse = { data: tracksMock };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tracks with default params at first render', async () => {
    // given
    mocked(axios.get).mockResolvedValue(getTracksResponse);
    // when
    const { result, waitForNextUpdate } = renderHook(() => usePaginatedTracks(options));
    // then
    await waitForNextUpdate();
    expect(result.current).toStrictEqual({
      submitErrors: undefined,
      tracks: tracksMock,
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${options.API_ROUTE_TRACKS}?offset=${DEFAULT_OFFSET}&size=${DEFAULT_SIZE}`,
    );
  });

  describe('should get tracks depends on query params', () => {
    it('should call axios.get with formatted endpoint based on query params', async () => {
      // given
      mocked(axios.get).mockResolvedValue(getTracksResponse);
      // when
      const { waitForNextUpdate } = renderHook(() => usePaginatedTracks(options));
      act(() => {
        mocked(useLocation).mockReturnValueOnce({
          search: '?size=2&offset=30',
        } as Location);
      });
      // then
      await waitForNextUpdate();
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect((axios.get as jest.Mock).mock.calls).toEqual([
        [`${options.API_ROUTE_TRACKS}?offset=${DEFAULT_OFFSET}&size=${DEFAULT_SIZE}`],
        [`${options.API_ROUTE_TRACKS}?offset=30&size=2`],
      ]);
    });

    it('should resolve axios.get and return tracks', async () => {
      // given
      const mockTracksNextPageMock = ['foo', 'bar'];
      const mockTracksNextPageResponseMock = { data: mockTracksNextPageMock };
      mocked(axios.get)
        .mockResolvedValueOnce(getTracksResponse)
        .mockResolvedValueOnce(mockTracksNextPageResponseMock);
      // when
      const { result, waitForNextUpdate } = renderHook(() => usePaginatedTracks(options));
      act(() => {
        mocked(useLocation).mockReturnValueOnce({
          search: '?size=2&offset=30',
        } as Location);
      });
      // then
      await waitForNextUpdate();
      expect(result.current).toStrictEqual({
        submitErrors: undefined,
        tracks: mockTracksNextPageMock,
      });
    });

    it('should reject axios.get and console.error', async () => {
      // given
      const errorMock = new Error('error');
      mocked(axios.get).mockRejectedValueOnce(errorMock);
      // when
      const { result, waitForNextUpdate } = renderHook(() => usePaginatedTracks(options));
      // then
      await waitForNextUpdate();
      expect(result.current).toStrictEqual({
        submitErrors: errorMock,
        tracks: {},
      });
    });
  });
});
