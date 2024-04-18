import type { AxiosResponse } from 'axios';
import axios from 'axios';

import { objectToFormData } from '@fc/common';
import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import { AxiosException } from '../errors';
import { getRequestOptions } from '../utils';
import * as HttpClientService from './http-client.service';

jest.mock('axios');
jest.mock('@fc/config');
jest.mock('@fc/common');

jest.mock('./../utils');

describe('HttpClientService', () => {
  // given
  const axiosRequestMock = jest.mocked(axios.request);
  const getConfigMock = jest.mocked(ConfigService.get);
  const getRequestOptionsMock = jest.mocked(getRequestOptions);

  beforeEach(() => {
    // given
    getConfigMock.mockReturnValue({ apiCsrfURL: '/any-csrf-token-endpoint' });
  });

  describe('makeRequest', () => {
    // given
    const method = 'get';
    const endpoint = '/any-endpoint';
    const data = { anyValueKey: 'any-value-mock' };
    const requestTarget = { data, method, url: endpoint };
    const axiosOptions = { validateStatus: () => expect.any(Boolean) };

    it('should call getRequestOptions with parameters, when axiosOptions is not defined', async () => {
      // when
      await HttpClientService.makeRequest(method, endpoint, data);

      // then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestTarget, {});
    });

    it('should call getRequestOptions with parameters, when data is an instance of URLSearchParams', () => {
      // given
      const dataUrlParams = new URLSearchParams();
      const requestWithUrlParams = { data: dataUrlParams, method, url: endpoint };

      // when
      HttpClientService.makeRequest(method, endpoint, dataUrlParams);

      // then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestWithUrlParams, {});
    });

    it('should call getRequestOptions with an empty data object, when data is undefined', () => {
      // given
      const requestWithoutData = { data: {}, method, url: endpoint };

      // when
      HttpClientService.makeRequest(method, endpoint);

      // then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestWithoutData, {});
    });

    it('should call getRequestOptions with parameters, when axiosOptions is defined', async () => {
      // when
      await HttpClientService.makeRequest(method, endpoint, data, axiosOptions);

      // then
      expect(getRequestOptionsMock).toHaveBeenCalledOnce();
      expect(getRequestOptionsMock).toHaveBeenCalledWith(requestTarget, axiosOptions);
    });

    it('should call axios with parameters', async () => {
      // given
      const requestOptionsMock = { data, method, url: endpoint };
      jest.mocked(getRequestOptionsMock).mockReturnValueOnce(requestOptionsMock);
      // when
      await HttpClientService.makeRequest(method, endpoint, data);

      // then
      expect(axiosRequestMock).toHaveBeenCalledOnce();
      expect(axiosRequestMock).toHaveBeenCalledWith(requestOptionsMock);
    });
  });

  describe('with makeRequest', () => {
    // given
    const endpoint = '/any-endpoint';
    const data = { anyValueKey: 'any-value-mock' };
    const axiosOptions = { validateStatus: () => expect.any(Boolean) };

    const errorMock = new Error('Async error');
    const responseMock = { data: 'any-response-data' } as unknown as AxiosResponse;

    beforeEach(() => {
      // given
      jest.spyOn(HttpClientService, 'makeRequest');
      getConfigMock.mockReturnValue({ apiCsrfURL: '/any-csrf-token-endpoint' });
    });

    describe('getCSRF', () => {
      it('should call ConfigService.get with parameters', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // when
        await HttpClientService.getCSRF();

        // then
        expect(getConfigMock).toHaveBeenCalledOnce();
        expect(getConfigMock).toHaveBeenCalledWith(Options.CONFIG_NAME);
      });

      it('should call makeRequest with parameters', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // when
        await HttpClientService.getCSRF();

        // then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'get',
          '/any-csrf-token-endpoint',
        );
      });

      it('should throw a AxiosException on error', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);

        // when
        await expect(
          () => HttpClientService.getCSRF(),

          // then
        ).rejects.toThrow(AxiosException);
      });
    });

    describe('get', () => {
      it('should call makeRequest with parameters', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);

        // when
        await HttpClientService.get(endpoint, data, axiosOptions);

        // then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'get',
          endpoint,
          data,
          axiosOptions,
        );
      });

      it('should throw an AxiosException on error', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);

        // then
        await expect(() =>
          // when
          HttpClientService.get(endpoint, data, axiosOptions),
        ).rejects.toThrow(AxiosException);
      });
    });

    describe('post', () => {
      beforeEach(() => {
        // given
        jest.spyOn(HttpClientService, 'getCSRF');
      });

      it('should call getCSRF', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);
        jest
          .mocked(HttpClientService.getCSRF)
          .mockResolvedValueOnce({ csrfToken: 'any-csrf-token' });

        // when
        await HttpClientService.post(endpoint, data, axiosOptions);

        // then
        expect(HttpClientService.getCSRF).toHaveBeenCalledOnce();
      });

      it('should call makeRequest with parameters', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockResolvedValueOnce(responseMock);
        jest
          .mocked(HttpClientService.getCSRF)
          .mockResolvedValueOnce({ csrfToken: 'any-csrf-token' });

        // when
        await HttpClientService.post(endpoint, data, axiosOptions);

        // then
        expect(HttpClientService.makeRequest).toHaveBeenCalledOnce();
        expect(HttpClientService.makeRequest).toHaveBeenCalledWith(
          'post',
          endpoint,
          { ...data, _csrf: 'any-csrf-token' },
          { ...axiosOptions, transformRequest: jest.mocked(objectToFormData) },
        );
      });

      it('should throw an AxiosException on error', async () => {
        // given
        jest.mocked(HttpClientService.makeRequest).mockRejectedValueOnce(errorMock);
        jest
          .mocked(HttpClientService.getCSRF)
          .mockResolvedValueOnce({ csrfToken: 'any-csrf-token' });

        // then
        await expect(() =>
          // when
          HttpClientService.post(endpoint, data, axiosOptions),
        ).rejects.toThrow(AxiosException);
      });
    });
  });
});
