import { DekAlg, KekAlg } from '@fc/cryptography';

export interface DataProviderMetadata {
  uid: string;
  title: string;
  active: boolean;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: string;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_endpoint_auth_signing_alg: KekAlg;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_alg: KekAlg;
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_enc: DekAlg;
}
