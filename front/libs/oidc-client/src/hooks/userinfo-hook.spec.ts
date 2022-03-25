import { renderHook } from '@testing-library/react-hooks';
import { useContext } from 'react';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';
import { AppContext } from '@fc/state-management';

import { useUserinfos } from './userinfo.hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('@fc/state-management', () => ({
  AppContext: {},
}));

jest.mock('@fc/common');

const contextMock = {
  state: {
    config: {
      OidcClient: {
        endpoints: {
          getUserInfos: '/foo/bar',
        },
      },
    },
  },
  update: jest.fn(),
};
const userMock = {};

const useContextMocked = mocked(useContext);
const useApiGetMocked = mocked(useApiGet);

describe('useUserInfosHook', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    useContextMocked.mockReturnValue(contextMock);
    useApiGetMocked.mockReturnValue(userMock);
  });

  describe('useUserinfos', () => {
    it('should call useContext()', () => {
      // When
      renderHook(() => useUserinfos());
      // Then
      expect(useContextMocked).toHaveBeenCalledTimes(1);
      expect(useContextMocked).toHaveBeenCalledWith(AppContext);
    });

    it('should call useApiGet()', () => {
      // When
      renderHook(useUserinfos);
      // Then
      expect(useApiGetMocked).toHaveBeenCalledTimes(1);
      expect(useApiGetMocked).toHaveBeenCalledWith(
        {
          endpoint: contextMock.state.config.OidcClient.endpoints.getUserInfos,
        },
        expect.any(Function),
      );
    });

    it('should return result of useApiGet', () => {
      // When
      const { result } = renderHook(() => useUserinfos());
      // Then
      expect(result.current).toBe(userMock);
    });
  });

  describe('useUserinfos callback', () => {
    it('should call update', () => {
      // Given
      renderHook(() => useUserinfos());
      // Using `!` syntax because we know we have 2 arguments
      // passed to `useApiGetMocked` in `useUserinfos`
      const callback = useApiGetMocked.mock.calls[0][1]!;

      // When
      callback(userMock);

      // Then
      expect(contextMock.update).toHaveBeenCalledTimes(1);
      expect(contextMock.update).toHaveBeenCalledWith({ user: userMock });
    });
  });
});
