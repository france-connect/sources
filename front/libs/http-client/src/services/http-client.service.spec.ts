import type { AxiosResponse } from 'axios';
import axios from 'axios';

import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import { AxiosException } from '../errors';
import { getRequestOptions } from '../utils';
import * as HttpClientService from './http-client.service';

// Given
jest.mock('./../utils');

describe('HttpClientService', () => {
  // Given
  const axiosRequestMock = jest.mocked(axios.request);
  const getConfigMock = jest.mocked(ConfigService.get);
  const getRequestOptionsMock = jest.mocked(getRequestOptions);

  beforeEach(() => {
    // Given
    getConfigMock.mockReturnValue({ apiCsrfURL: '/any-csrf-token-endpoint' });
  });

  describe('makeRequest', () => {
    // Given
    const method = 'get';
    const endpoint = '/any-endpoint';
    const data = { anyValueKey: 'any-value-mock' };
    const requestTarget = { data, method, url: endpoint };
    const axiosOptions = { validateStatus: () => expect.any(Boolean) };

    it('should call getRequestOptions with parameters, when axiosOptions is not defined', async () => {
      // When
      await HttpClientService.makeRequest(method, endpoint, data);

      // Then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestTarget, {});
    });

    it('should call getRequestOptions with parameters, when data is an instance of URLSearchParams', () => {
      // Given
      const dataUrlParams = new URLSearchParams();
      const requestWithUrlParams = { data: dataUrlParams, method, url: endpoint };

      // When
      HttpClientService.makeRequest(method, endpoint, dataUrlParams);

      // Then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestWithUrlParams, {});
    });

    it('should call getRequestOptions with an empty data object, when data is undefined', () => {
      // Given
      const requestWithoutData = { data: {}, method, url: endpoint };

      // When
      HttpClientService.makeRequest(method, endpoint);

      // Then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestWithoutData, {});
    });

    it('should call getRequestOptions with parameters, when axiosOptions is defined', async () => {
      // When
      await HttpClientService.makeRequest(method, endpoint, data, axiosOptions);

      // Then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestTarget, axiosOptions);
    });

    it('should call axios with parameters', async () => {
      // Given
      const requestOptionsMock = { data, method, url: endpoint };
      jest.mocked(getRequestOptionsMock).mockReturnValueOnce(requestOptionsMock);
      // When
      await HttpClientService.makeRequest(method, endpoint, data);

      // Then
      expect(axiosRequestMock).toHaveBeenCalledOnce();
      expect(axiosRequestMock).toHaveBeenCalledWith(requestOptionsMock);
    });
  });

  describe('with makeRequest', () => {
    // Given
    const endpoint = '/any-endpoint';
    const data = { anyValueKey: 'any-value-mock' };
    const axiosOptions = { validateStatus: () => expect.any(Boolean) };

    const errorMock = new Error('Async error');
    const responseMock = { data: 'any-response-data' } as unknown as AxiosResponse;

    beforeEach(() => {
      // Given
      jest.spyOn(HttpClientService, 'makeRequest');
      getConfigMock.mockReturnValue({ apiCsrfURL: '/any-csrf-token-endpoint' });
    });

    describe('getCSRF', () => {
      it('should call ConfigService.get with parameters', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // When
        await HttpClientService.getCSRF();

        // Then
        expect(getConfigMock).toHaveBeenCalledOnce();
        expect(getConfigMock).toHaveBeenCalledWith(Options.CONFIG_NAME);
      });

      it('should call makeRequest with parameters', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // When
        await HttpClientService.getCSRF();

        // Then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'get',
          '/any-csrf-token-endpoint',
        );
      });

      it('should throw a AxiosException on error', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);

        // When
        await expect(
          () => HttpClientService.getCSRF(),

          // Then
        ).rejects.toThrow(AxiosException);
      });
    });

    describe('get', () => {
      it('should call makeRequest with parameters', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // When
        await HttpClientService.get(endpoint, data, axiosOptions);

        // Then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'get',
          endpoint,
          data,
          axiosOptions,
        );
      });

      it('should throw an AxiosException on error', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);

        // Then
        await expect(() =>
          // When
          HttpClientService.get(endpoint, data, axiosOptions),
        ).rejects.toThrow(AxiosException);
      });
    });

    describe('post', () => {
      const csrfTokenMock = 'any-csrf-token';

      beforeEach(() => {
        // Given
        jest.spyOn(HttpClientService, 'getCSRF');
      });

      it('should call getCSRF', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);
        jest.mocked(HttpClientService.getCSRF).mockResolvedValueOnce({ csrfToken: csrfTokenMock });

        // When
        await HttpClientService.post(endpoint, data, axiosOptions);

        // Then
        expect(HttpClientService.getCSRF).toHaveBeenCalledOnce();
      });

      it('should call makeRequest with parameters', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);
        jest.mocked(HttpClientService.getCSRF).mockResolvedValueOnce({ csrfToken: csrfTokenMock });

        // When
        await HttpClientService.post(endpoint, data, axiosOptions);

        // Then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'post',
          endpoint,
          { ...data },
          {
            ...axiosOptions,
            headers: {
              // Conventional header name
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'Content-Type': 'application/x-www-form-urlencoded',
              // Conventional header name
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'x-csrf-token': csrfTokenMock,
            },
          },
        );
      });

      it('should throw an AxiosException on error', async () => {
        // Given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);
        jest.mocked(HttpClientService.getCSRF).mockResolvedValueOnce({ csrfToken: csrfTokenMock });

        // Then
        await expect(() =>
          // When
          HttpClientService.post(endpoint, data, axiosOptions),
        ).rejects.toThrow(AxiosException);
      });
    });
  });
});
