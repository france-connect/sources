/**
 * @see Axios Request Configuration documentation
 * https://axios-http.com/docs/req_config
 *
 */
import type { AxiosRequestConfig } from 'axios';
import { omit } from 'lodash';

import { ConfigService } from '@fc/config';

import { HttpClientOptions } from '../enums';
import type {
  HttpClientConfig,
  HttpClientOptionsInterface,
  HttpClientRequestInterface,
} from '../interfaces';
import { slashifyPath } from './slashify-path';

export const getTimeout = (requestOptions: HttpClientOptionsInterface) => {
  if (requestOptions?.timeout) {
    return requestOptions.timeout;
  }

  const serviceConfig = ConfigService.get<HttpClientConfig>(HttpClientOptions.CONFIG_NAME);
  if (serviceConfig?.timeout) {
    return serviceConfig.timeout;
  }

  return HttpClientOptions.TIMEOUT;
};

export const getBaseURL = (requestOptions: HttpClientOptionsInterface) => {
  if (requestOptions?.baseURL) {
    return requestOptions.baseURL;
  }

  const serviceConfig = ConfigService.get<HttpClientConfig>(HttpClientOptions.CONFIG_NAME);
  if (serviceConfig?.baseURL) {
    return serviceConfig.baseURL;
  }

  return undefined;
};

export const getRequestOptions = (
  targetRequest: HttpClientRequestInterface,
  requestOptions: HttpClientOptionsInterface = {},
): AxiosRequestConfig => {
  const timeout = getTimeout(requestOptions);
  const baseURL = getBaseURL(requestOptions);
  const url = slashifyPath(targetRequest.url, baseURL);

  // @NOTE baseURL/timeout should not be used into final axios request options
  // because we create it with slashifyPath from  axiosOptions > serviceConfig
  const omitted = ['baseURL', 'timeout'];
  const axiosOptions = omit(requestOptions, omitted);

  const merged = { ...targetRequest, ...axiosOptions, timeout, url };
  return merged;
};
