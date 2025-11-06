import { createPublicKey, JsonWebKey, KeyObject } from 'crypto';

import { JWK } from 'jose';
import { ExternalSigningKey } from 'oidc-provider';

export class OidcProviderSignAdapter extends ExternalSigningKey {
  constructor(
    private readonly _kid: string,
    private readonly _alg: string,
    private readonly _pubKey: KeyObject,
    private readonly _signFn: (
      data: Uint8Array,
      alg: string,
    ) => Promise<Uint8Array>,
  ) {
    super();
  }

  get alg() {
    return this._alg;
  }

  get kid() {
    return this._kid;
  }

  get use(): 'sig' {
    return 'sig';
  }

  keyObject() {
    return this._pubKey;
  }

  async sign(data: Uint8Array) {
    return await this._signFn(data, this._alg);
  }

  static fromJwk(
    jwk: JWK,
    signFn: (data: Uint8Array, alg: string) => Promise<Uint8Array>,
  ): OidcProviderSignAdapter {
    const pubKey = createPublicKey({
      key: jwk as JsonWebKey,
      format: 'jwk',
    });

    return new OidcProviderSignAdapter(jwk.kid, jwk.alg, pubKey, signFn);
  }
}
