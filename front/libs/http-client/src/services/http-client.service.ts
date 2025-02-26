/**
 * @see Axios Request Configuration documentation
 * https://axios-http.com/docs/req_config
 *
 */
import type { AxiosError, AxiosResponse, Method } from 'axios';
import axios from 'axios';

import { ContentType, HttpMethods } from '@fc/common';
import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import { AxiosException } from '../errors';
import type {
  GetCsrfTokenResponseInterface,
  HttpClientConfig,
  HttpClientDataInterface,
  HttpClientOptionsInterface,
} from '../interfaces';
import { getRequestOptions } from '../utils';

export const makeRequest = async <T = unknown>(
  method: Method,
  endpoint: string,
  data: HttpClientDataInterface | URLSearchParams = {},
  axiosOptions: HttpClientOptionsInterface = {},
): Promise<AxiosResponse<T>> => {
  const requestTarget = { data, method, url: endpoint };
  const request = getRequestOptions(requestTarget, axiosOptions);
  const response = await axios.request<T>(request);
  return response;
};

/**
 *
 * @param data URLSearchParams
 * @returns
 */
export const getCSRF = async (): Promise<GetCsrfTokenResponseInterface> => {
  try {
    const { apiCsrfURL } = ConfigService.get<HttpClientConfig>(Options.CONFIG_NAME);

    const method = HttpMethods.GET;
    const endpoint = apiCsrfURL;
    const { data } = await makeRequest<GetCsrfTokenResponseInterface>(method, endpoint);
    return data;
  } catch (err) {
    const error = { message: 'Error while trying to get CSRF token' } as AxiosError;
    throw new AxiosException(error);
  }
};

/**
 *
 * @param endpoint Relative leading slashed string to a single API entry point (eg: '/hello-world')
 * @param data HttpClientDataInterface | URLSearchParams
 * @param axiosOptions AxiosRequestConfig
 * @returns
 */
export const get = async <T = unknown>(
  endpoint: string,
  data?: HttpClientDataInterface | URLSearchParams,
  options?: HttpClientOptionsInterface,
): Promise<AxiosResponse<T>> => {
  try {
    const method = HttpMethods.GET;
    return await makeRequest<T>(method, endpoint, data, options);
  } catch (err) {
    const error = err as AxiosError;
    throw new AxiosException(error);
  }
};

/**
 *
 * @param endpoint Relative leading slashed string to a single API entry point (eg: '/hello-world')
 * @param data HttpClientDataInterface
 * @param axiosOptions AxiosRequestConfig
 * @returns
 */
export const post = async <T>(
  endpoint: string,
  data: HttpClientDataInterface,
  options?: HttpClientOptionsInterface,
): Promise<AxiosResponse<T>> => {
  try {
    const { csrfToken } = await getCSRF();
    const datas = { ...data };
    const response = await makeRequest<T>(HttpMethods.POST, endpoint, datas, {
      headers: {
        // Conventional header name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': ContentType.FORM_URL_ENCODED,
        // Conventional header name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'x-csrf-token': csrfToken,
      },
      ...options,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError;
    throw new AxiosException(error);
  }
};
