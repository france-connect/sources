import axios from 'axios';
import { mocked } from 'ts-jest/utils';

import { UserInfosException } from './user-infos.exception';
import { UserInfosService } from './user-infos.service';

const axiosGetMock = mocked(axios.get);

describe('UserInfosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchData', () => {
    it('should call axios.get with the url', async () => {
      // given
      axiosGetMock.mockResolvedValueOnce({ data: 'any-data-response' });
      // when
      await UserInfosService.fetchData('any-endpoint-mock', jest.fn());
      // then
      expect(axiosGetMock).toHaveBeenCalledTimes(1);
      expect(axiosGetMock).toHaveBeenCalledWith('any-endpoint-mock');
    });

    describe('should call callback function with values on success', () => {
      it('as connected when userinfos is defined and valid', async () => {
        // given
        const userinfosMock = {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: 'any-family_name-mock',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'any-given_name-mock',
        };
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: {
            userinfos: userinfosMock,
          },
        });
        // when
        await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, { ready: false });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: true,
          ready: true,
          userinfos: userinfosMock,
        });
      });

      it('as not connected when userinfos is undefined', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({ data: { userinfos: undefined } });
        // when
        await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, {
          ready: false,
        });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: false,
          ready: true,
          userinfos: undefined,
        });
      });

      it('as not connected when data has no userinfos', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({ data: {} });
        // when
        await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, {
          ready: false,
        });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: false,
          ready: true,
          userinfos: undefined,
        });
      });

      it('as not connected when userinfos has only given_name', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: {
            userinfos: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              given_name: 'any-given_name-mock',
            },
          },
        });
        // when
        await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, {
          ready: false,
        });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: false,
          ready: true,
          userinfos: undefined,
        });
      });

      it('is not connected when userinfos has only family_name', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: {
            userinfos: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              family_name: 'any-family_name-mock',
            },
          },
        });
        // when
        await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, {
          ready: false,
        });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: false,
          ready: true,
          userinfos: undefined,
        });
      });
    });

    it('should call callback when api is errored with a 401 status', async () => {
      // given
      const callbackMock = jest.fn();
      axiosGetMock.mockRejectedValueOnce({ response: { status: 401 } });
      // when
      await UserInfosService.fetchData('any-endpoint-mock', callbackMock);
      // then
      expect(callbackMock).toHaveBeenCalledTimes(2);
      expect(callbackMock).toHaveBeenNthCalledWith(1, {
        ready: false,
      });
      expect(callbackMock).toHaveBeenNthCalledWith(2, {
        connected: false,
        ready: true,
      });
    });

    describe('should throw when api', () => {
      it('is errored', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce(new Error('mock error'));
        // then
        await expect(() =>
          // when
          UserInfosService.fetchData('any-endpoint-mock', jest.fn()),
        ).rejects.toThrow(expect.any(UserInfosException));
      });

      it('is errored with a status not equal to 401', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({ response: { status: 200 } });
        // then
        await expect(() =>
          // when
          UserInfosService.fetchData('any-endpoint-mock', jest.fn()),
        ).rejects.toThrow(expect.any(UserInfosException));
      });

      it('is errored with an empty response', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({ response: {} });
        // then
        await expect(() =>
          // when
          UserInfosService.fetchData('any-endpoint-mock', jest.fn()),
        ).rejects.toThrow(expect.any(UserInfosException));
      });

      it('is errored when response is undefined', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({});
        // then
        await expect(() =>
          // when
          UserInfosService.fetchData('any-endpoint-mock', jest.fn()),
        ).rejects.toThrow(expect.any(UserInfosException));
      });
    });
  });
});
