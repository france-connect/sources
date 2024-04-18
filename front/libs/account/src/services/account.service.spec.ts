import axios from 'axios';

import { AccountService } from './account.service';

jest.mock('axios');

describe('AccountService', () => {
  // given
  const axiosGetMock = jest.mocked(axios.get);
  const consoleWarnMock = jest.spyOn(global.console, 'warn').mockImplementation();

  describe('fetchData', () => {
    it('should call axios.get with the url', async () => {
      // given
      axiosGetMock.mockResolvedValueOnce({ data: 'any-data-response' });

      // when
      await AccountService.fetchData('any-endpoint-mock', jest.fn());

      // then
      expect(axiosGetMock).toHaveBeenCalledOnce();
      expect(axiosGetMock).toHaveBeenCalledWith('any-endpoint-mock');
    });

    describe('connection cases', () => {
      it('should call callback function as connected when userinfos is defined and valid', async () => {
        // given
        const userinfosMock = {
          firstname: 'any-firstname-mock',
          lastname: 'any-lastname-mock',
        };
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: userinfosMock,
        });

        // when
        await AccountService.fetchData('any-endpoint-mock', callbackMock);

        // then
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(callbackMock).toHaveBeenNthCalledWith(1, { ready: false });
        expect(callbackMock).toHaveBeenNthCalledWith(2, {
          connected: true,
          ready: true,
          userinfos: userinfosMock,
        });
      });

      it('should call callback function as not connected when userinfos is undefined', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: undefined,
        });

        // when
        await AccountService.fetchData('any-endpoint-mock', callbackMock);

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

      it('should call callback function as not connected when data has no userinfos', async () => {
        // given
        const callbackMock = jest.fn();
        axiosGetMock.mockResolvedValueOnce({
          data: {},
        });

        // when
        await AccountService.fetchData('any-endpoint-mock', callbackMock);

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
      await AccountService.fetchData('any-endpoint-mock', callbackMock);

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

    describe('call console.warn calls', () => {
      // @TODO to be removed when Account Exception has been implemented
      it('should call console.warn if an error occur on data fetching', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce(new Error('mock error'));

        // when
        await AccountService.fetchData('any-endpoint-mock', jest.fn());

        // then
        expect(consoleWarnMock).toHaveBeenCalled();
      });

      it("should call console.warn if an error occur on data fetching if error status doesn't equal to 401", async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({ response: { status: 402 } });

        // when
        await AccountService.fetchData('any-endpoint-mock', jest.fn());

        // then
        expect(consoleWarnMock).toHaveBeenCalled();
      });

      it('should call console.warn if an error occur on data fetching if response is empty', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({ response: {} });

        // when
        await AccountService.fetchData('any-endpoint-mock', jest.fn());

        // then
        expect(consoleWarnMock).toHaveBeenCalled();
      });

      it('should call console.warn if an error occur on data fetching if response is undefined', async () => {
        // given
        axiosGetMock.mockRejectedValueOnce({});

        // when
        await AccountService.fetchData('any-endpoint-mock', jest.fn());

        // then
        expect(consoleWarnMock).toHaveBeenCalled();
      });
    });
  });
});
