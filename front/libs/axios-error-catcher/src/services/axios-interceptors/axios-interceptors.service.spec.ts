import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import {
  addAxiosCatcherInterceptors,
  removeAxiosCatcherInterceptors,
} from './axios-interceptors.service';

describe('addAxiosCatcherInterceptors', () => {
  it('should create the request and response interceptors', () => {
    // given
    const updateStateMock = jest.fn();

    const axiosInterceptorRequestUseMock = jest
      .spyOn(axios.interceptors.request, 'use')
      .mockReturnValueOnce(1);

    const axiosInterceptorResponseUseMock = jest
      .spyOn(axios.interceptors.response, 'use')
      .mockReturnValueOnce(2);

    // when
    const result = addAxiosCatcherInterceptors(updateStateMock);

    // then
    expect(axiosInterceptorRequestUseMock).toHaveBeenCalled();
    expect(axiosInterceptorRequestUseMock).toHaveBeenCalledWith(expect.any(Function), undefined);
    expect(axiosInterceptorResponseUseMock).toHaveBeenCalled();
    expect(axiosInterceptorResponseUseMock).toHaveBeenCalledWith(undefined, expect.any(Function));
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([1, 2]);
  });

  it('should call the success callback with params', () => {
    // given
    const configMock = Symbol('any-config-mock') as unknown as InternalAxiosRequestConfig;
    const updateStateMock = jest.fn();
    const axiosInterceptorRequestUseMock = jest.spyOn(axios.interceptors.request, 'use');

    // when
    addAxiosCatcherInterceptors(updateStateMock);
    const successCallback = axiosInterceptorRequestUseMock.mock.calls[0][0];
    const result = successCallback!(configMock);

    // then
    expect(result).toStrictEqual(configMock);
    expect(updateStateMock).toHaveBeenCalled();
    expect(updateStateMock).toHaveBeenCalledWith(expect.any(Function));

    // when
    // Check the function passed to updateState
    const updateStateArg = updateStateMock.mock.calls[0][0];
    const newState = updateStateArg({ codeError: 'some error', hasError: true });

    // then
    expect(newState).toStrictEqual({ codeError: undefined, hasError: false });
  });

  it('should call the error callback params', async () => {
    // given
    const updateStateMock = jest.fn();
    const axiosInterceptorResponseUseMock = jest.spyOn(axios.interceptors.response, 'use');

    // when / then
    addAxiosCatcherInterceptors(updateStateMock);
    const errorCallback = axiosInterceptorResponseUseMock.mock.calls[0][1];

    await expect(() =>
      errorCallback!({ response: { status: 401 } } as AxiosError),
    ).rejects.toStrictEqual({ response: { status: 401 } } as AxiosError);

    // then
    expect(updateStateMock).toHaveBeenCalled();
    expect(updateStateMock).toHaveBeenCalledWith(expect.any(Function));

    // when
    // Check the function passed to updateState
    const updateStateArg = updateStateMock.mock.calls[0][0];
    const newState = updateStateArg({ codeError: undefined, hasError: false });

    // then
    expect(newState).toStrictEqual({ codeError: 401, hasError: true });
  });
});

describe('removeAxiosCatcherInterceptors', () => {
  it('should eject the request and response interceptors', () => {
    // given
    const requestInterceptor = 1;
    const errorInterceptor = 2;

    const axiosInterceptorRequestEjectMock = jest.spyOn(axios.interceptors.request, 'eject');
    const axiosInterceptorResponseEjectMock = jest.spyOn(axios.interceptors.response, 'eject');

    // when
    removeAxiosCatcherInterceptors([requestInterceptor, errorInterceptor]);

    // then
    expect(axiosInterceptorRequestEjectMock).toHaveBeenCalledWith(requestInterceptor);
    expect(axiosInterceptorResponseEjectMock).toHaveBeenCalledWith(errorInterceptor);
  });
});