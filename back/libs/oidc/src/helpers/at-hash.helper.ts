import { createHash } from 'crypto';

import { AccessToken } from '../interfaces';

/**
 * Inspired by discussions on stackoverflow
 * @see https://stackoverflow.com/questions/30356460/how-do-i-validate-an-access-token-using-the-at-hash-claim-of-an-id-token
 */
export const atHashFromAccessToken = (accessToken: AccessToken) => {
  const { jti } = accessToken;

  let hash = createHash('sha256').update(jti).digest('hex').substring(0, 32);

  const buff = Buffer.from(hash, 'hex');
  hash = buff.toString('base64');
  hash = hash.replace(/=/g, '');
  hash = hash.replace(/\//g, '_');
  hash = hash.replace(/\+/g, '-');

  return hash;
};
