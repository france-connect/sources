import { DekAlg, KekAlg } from '@fc/cryptography';

export interface DataProviderMetadata {
  uid: string;
  title: string;
  active: boolean;
  slug: string;
  client_id: string;
  client_secret: string;
  jwks_uri: string;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_signed_response_alg: KekAlg;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_alg: KekAlg;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_enc: DekAlg;
}
