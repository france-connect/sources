import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import {
  addAxiosCatcherInterceptors,
  removeAxiosCatcherInterceptors,
} from './axios-interceptors.service';

describe('addAxiosCatcherInterceptors', () => {
  it('should create the request and response interceptors', () => {
    // Given
    const updateStateMock = jest.fn();

    const axiosInterceptorRequestUseMock = jest
      .spyOn(axios.interceptors.request, 'use')
      .mockReturnValueOnce(1);

    const axiosInterceptorResponseUseMock = jest
      .spyOn(axios.interceptors.response, 'use')
      .mockReturnValueOnce(2);

    // When
    const result = addAxiosCatcherInterceptors(updateStateMock);

    // Then
    expect(axiosInterceptorRequestUseMock).toHaveBeenCalled();
    expect(axiosInterceptorRequestUseMock).toHaveBeenCalledWith(expect.any(Function), undefined);
    expect(axiosInterceptorResponseUseMock).toHaveBeenCalled();
    expect(axiosInterceptorResponseUseMock).toHaveBeenCalledWith(undefined, expect.any(Function));
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([1, 2]);
  });

  it('should call the success callback with params', () => {
    // Given
    const configMock = Symbol('any-config-mock') as unknown as InternalAxiosRequestConfig;
    const updateStateMock = jest.fn();
    const axiosInterceptorRequestUseMock = jest.spyOn(axios.interceptors.request, 'use');

    // When
    addAxiosCatcherInterceptors(updateStateMock);
    const successCallback = axiosInterceptorRequestUseMock.mock.calls[0][0];
    const result = successCallback!(configMock);

    // Then
    expect(result).toStrictEqual(configMock);
    expect(updateStateMock).toHaveBeenCalled();
    expect(updateStateMock).toHaveBeenCalledWith(expect.any(Function));

    // When
    // Check the function passed to updateState
    const updateStateArg = updateStateMock.mock.calls[0][0];
    const newState = updateStateArg({ codeError: 'some error', hasError: true });

    // Then
    expect(newState).toStrictEqual({ codeError: undefined, hasError: false });
  });

  it('should call the error callback params', async () => {
    // Given
    const updateStateMock = jest.fn();
    const axiosInterceptorResponseUseMock = jest.spyOn(axios.interceptors.response, 'use');

    // When / then
    addAxiosCatcherInterceptors(updateStateMock);
    const errorCallback = axiosInterceptorResponseUseMock.mock.calls[0][1];

    await expect(() =>
      errorCallback!({ response: { status: 401 } } as AxiosError),
    ).rejects.toStrictEqual({ response: { status: 401 } } as AxiosError);

    // Then
    expect(updateStateMock).toHaveBeenCalled();
    expect(updateStateMock).toHaveBeenCalledWith(expect.any(Function));

    // When
    // Check the function passed to updateState
    const updateStateArg = updateStateMock.mock.calls[0][0];
    const newState = updateStateArg({ codeError: undefined, hasError: false });

    // Then
    expect(newState).toStrictEqual({ codeError: 401, hasError: true });
  });
});

describe('removeAxiosCatcherInterceptors', () => {
  it('should eject the request and response interceptors', () => {
    // Given
    const requestInterceptor = 1;
    const errorInterceptor = 2;

    const axiosInterceptorRequestEjectMock = jest.spyOn(axios.interceptors.request, 'eject');
    const axiosInterceptorResponseEjectMock = jest.spyOn(axios.interceptors.response, 'eject');

    // When
    removeAxiosCatcherInterceptors([requestInterceptor, errorInterceptor]);

    // Then
    expect(axiosInterceptorRequestEjectMock).toHaveBeenCalledWith(requestInterceptor);
    expect(axiosInterceptorResponseEjectMock).toHaveBeenCalledWith(errorInterceptor);
  });
});
