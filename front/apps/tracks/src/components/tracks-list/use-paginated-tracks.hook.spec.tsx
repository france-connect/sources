import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import type { Location } from 'react-router';
import { useLocation } from 'react-router';

import { ConfigService } from '@fc/config';
import { get } from '@fc/http-client';

import { DEFAULT_OFFSET, DEFAULT_SIZE, usePaginatedTracks } from './use-paginated-tracks.hook';

describe('usePaginatedTracks', () => {
  // Given
  jest.mocked(ConfigService.get).mockReturnValue({
    endpoints: { tracks: 'any-tracks-route-mock' },
  });

  const tracksMock = ['tracks1', 'tracks2'];

  beforeEach(() => {
    // Given
    const response = { data: tracksMock } as unknown as AxiosResponse;
    jest.mocked(get).mockResolvedValue(response);
  });

  it('should call ConfigService with Tracks config name as argument', async () => {
    // When
    renderHook(() => usePaginatedTracks());

    // Then
    await waitFor(() => {
      expect(ConfigService.get).toHaveBeenCalledOnce();
      expect(ConfigService.get).toHaveBeenCalledWith('Tracks');
    });
  });

  it('should return tracks with default params at first render', async () => {
    // When
    const { result } = renderHook(() => usePaginatedTracks());

    // Then
    await waitFor(() => {
      expect(result.current).toStrictEqual({
        submitErrors: undefined,
        tracks: tracksMock,
      });
      expect(get).toHaveBeenCalledOnce();
      expect(get).toHaveBeenCalledWith(
        `any-tracks-route-mock?offset=${DEFAULT_OFFSET}&size=${DEFAULT_SIZE}`,
      );
    });
  });

  describe('should get tracks depends on query params', () => {
    it('should call axios.get with formatted endpoint based on query params', async () => {
      // When
      renderHook(() => usePaginatedTracks());
      jest.mocked(useLocation).mockReturnValueOnce({
        search: '?size=2&offset=30',
      } as Location);

      // Then
      await waitFor(() => {
        expect(get).toHaveBeenCalledTimes(2);
        expect(get).toHaveBeenNthCalledWith(
          1,
          `any-tracks-route-mock?offset=${DEFAULT_OFFSET}&size=${DEFAULT_SIZE}`,
        );
        expect(get).toHaveBeenNthCalledWith(2, `any-tracks-route-mock?offset=30&size=2`);
      });
    });

    it('should resolve get and return tracks', async () => {
      // Given
      const mockTracksNextPageMock = ['foo', 'bar'];

      const response = { data: tracksMock } as unknown as AxiosResponse;
      const mockTracksNextPageResponseMock = {
        data: mockTracksNextPageMock,
      } as unknown as AxiosResponse;

      jest
        .mocked(get)
        .mockResolvedValueOnce(response)
        .mockResolvedValueOnce(mockTracksNextPageResponseMock);
      jest.mocked(useLocation).mockReturnValueOnce({
        search: '?size=2&offset=30',
      } as Location);

      // When
      const { result } = renderHook(() => usePaginatedTracks());

      // Then
      await waitFor(() => {
        expect(result.current).toStrictEqual({
          submitErrors: undefined,
          tracks: mockTracksNextPageMock,
        });
      });
    });

    it('should reject get and console.error', async () => {
      // Given
      const errorMock = new Error('error');
      jest.mocked(get).mockRejectedValueOnce(errorMock);

      // When
      const { result } = renderHook(() => usePaginatedTracks());

      // Then
      await waitFor(() => {
        expect(result.current).toStrictEqual({
          submitErrors: errorMock,
          tracks: {},
        });
      });
    });
  });
});
