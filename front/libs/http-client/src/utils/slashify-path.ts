import { InvalidProtocol } from '../errors';
import { isValidProtocol } from './is-valid-protocol';

export const slashifyPath = (endpoint: string, baseURL: string = ''): string => {
  const isEndpointAbsolute = isValidProtocol(endpoint);
  if (isEndpointAbsolute || !baseURL) {
    return endpoint;
  }

  const isBaseUrlAbsolute = isValidProtocol(baseURL);
  if (!isBaseUrlAbsolute) {
    throw new InvalidProtocol();
  }

  const { href } = new URL(endpoint, baseURL);
  return href;
};
