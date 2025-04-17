import { createPublicKey, KeyObject } from 'crypto';

import { exportJWK, importJWK, JWK } from 'jose';

export class JwkHelper {
  static async publicFromPrivate(privateJwk: JWK): Promise<JWK> {
    const privateKey = await importJWK(privateJwk);

    const publicKey = createPublicKey(privateKey as KeyObject);

    const publicJwk = await exportJWK(publicKey);

    publicJwk.kid = privateJwk.kid;
    publicJwk.use = privateJwk.use;
    publicJwk.alg = privateJwk.alg;

    return publicJwk;
  }
}
