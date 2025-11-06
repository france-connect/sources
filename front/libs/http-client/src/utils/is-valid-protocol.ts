import { HttpClientOptions } from '../enums';

export const isValidProtocol = (url: string): boolean => {
  const regex = new RegExp(HttpClientOptions.ALLOWED_PROTOCOLS, 'g');
  const hasMatches = regex.test(url);
  return hasMatches;
};
