export interface IServiceProviderAdapterEnv {
  active: boolean;
  name: string;
  title: string;
  key: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;
  scopes: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uris: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  post_logout_redirect_uris: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_signed_response_alg: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_alg: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_enc: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_signed_response_alg: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_alg: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_enc: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: string;
}
