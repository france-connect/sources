import { act, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

import { AxiosErrorCatcherProvider } from './axios-error-catcher.provider';

describe('AxiosErrorCatcherProvider', () => {
  const setStateMock = jest.fn();

  it('should render the child component', () => {
    // given
    const axiosErrorCatcherProvider = (
      <AxiosErrorCatcherProvider>
        <div>children component</div>
      </AxiosErrorCatcherProvider>
    );
    // when
    const { getByText } = render(axiosErrorCatcherProvider);
    const element = getByText('children component');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should add an interceptor to axios responses on render', () => {
    // given
    const axiosErrorCatcherProvider = (
      <AxiosErrorCatcherProvider>
        <div>children component</div>
      </AxiosErrorCatcherProvider>
    );
    // when
    render(axiosErrorCatcherProvider);
    // then
    expect(axios.interceptors.response.use).toHaveBeenCalledOnce();
    expect(axios.interceptors.response.use).toHaveBeenCalledWith(undefined, expect.any(Function));
    expect(axios.interceptors.response.eject).toHaveBeenCalledTimes(0);
  });

  it('should eject axios response interceptor on component unmount', () => {
    // given
    const interceptorNumber = 123;
    jest.mocked(axios.interceptors.response.use).mockReturnValue(interceptorNumber);

    const axiosErrorCatcherProvider = (
      <AxiosErrorCatcherProvider>
        <div>children component</div>
      </AxiosErrorCatcherProvider>
    );
    // when
    const { unmount } = render(axiosErrorCatcherProvider);
    unmount();
    // then
    expect(axios.interceptors.response.eject).toHaveBeenCalledOnce();
    expect(axios.interceptors.response.eject).toHaveBeenCalledWith(interceptorNumber);
  });

  describe('Authenticated user', () => {
    beforeAll(() => {
      jest.spyOn(React, 'useContext').mockReturnValue({ connected: true });
    });

    it('should update state if error intercepted is 401', async () => {
      // given
      const error = { response: { status: 401 } };

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledOnce();
        expect(setStateMock).toHaveBeenCalledWith({ codeError: 401, hasError: true });
      });
    });

    it('should not update state if error intercepted is not 401', async () => {
      // given
      const error = { response: { status: 403 } };

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledTimes(0);
      });
    });

    it('should not update state if error intercepted is not related to response', async () => {
      // given
      const error = {};

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Unauthenticated user', () => {
    beforeAll(() => {
      jest.spyOn(React, 'useContext').mockReturnValue({ connected: false });
    });

    it('should not update state if intercepted error is 401', async () => {
      // given
      const error = { response: { status: 401 } };

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledTimes(0);
      });
    });

    it('should not update state if intercepted error is not 401', async () => {
      // given
      const error = { response: { status: 403 } };

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledTimes(0);
      });
    });

    it('should not update state if error intercepted does is related to response', async () => {
      // given
      const error = {};

      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [expect.any(Object), setStateMock]);

      const axiosErrorCatcherProvider = (
        <AxiosErrorCatcherProvider>
          <div>children component</div>
        </AxiosErrorCatcherProvider>
      );
      // when
      render(axiosErrorCatcherProvider);
      const [firstCall] = jest.mocked(axios.interceptors.response.use).mock.calls;
      const mockResponseErrorCallback = firstCall[1]!;
      act(() => {
        mockResponseErrorCallback(error).catch(() => {});
      });
      // then
      await waitFor(() => {
        expect(setStateMock).toHaveBeenCalledTimes(0);
      });
    });
  });
});
