/**
 * @see Axios Request Configuration documentation
 * https://axios-http.com/docs/req_config
 *
 */
import type { AxiosRequestConfig } from 'axios';
import lodashOmit from 'lodash.omit';

import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import type { HttpClientConfig, HttpClientOptions, HttpClientRequest } from '../interfaces';
import { slashifyPath } from './slashify-path';

export const getTimeout = (requestOptions: HttpClientOptions) => {
  if (requestOptions?.timeout) {
    return requestOptions.timeout;
  }

  const serviceConfig = ConfigService.get<HttpClientConfig>(Options.CONFIG_NAME);
  if (serviceConfig?.timeout) {
    return serviceConfig.timeout;
  }

  return Options.TIMEOUT;
};

export const getBaseURL = (requestOptions: HttpClientOptions) => {
  if (requestOptions?.baseURL) {
    return requestOptions.baseURL;
  }

  const serviceConfig = ConfigService.get<HttpClientConfig>(Options.CONFIG_NAME);
  if (serviceConfig?.baseURL) {
    return serviceConfig.baseURL;
  }

  return undefined;
};

export const getRequestOptions = (
  targetRequest: HttpClientRequest,
  requestOptions: HttpClientOptions = {},
): AxiosRequestConfig => {
  const timeout = getTimeout(requestOptions);
  const baseURL = getBaseURL(requestOptions);
  const url = slashifyPath(targetRequest.url, baseURL);

  // @NOTE baseURL/timeout should not be used into final axios request options
  // because we create it with slashifyPath from  axiosOptions > serviceConfig
  const omitted = ['baseURL', 'timeout'];
  const axiosOptions = lodashOmit(requestOptions, omitted);

  const merged = { ...targetRequest, ...axiosOptions, timeout, url };
  return merged;
};
