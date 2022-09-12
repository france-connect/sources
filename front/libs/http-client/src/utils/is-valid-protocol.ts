import { Options } from '../enums';

export const isValidProtocol = (url: string): boolean => {
  const regex = new RegExp(Options.ALLOWED_PROTOCOLS, 'g');
  const hasMatches = regex.test(url);
  return hasMatches;
};
