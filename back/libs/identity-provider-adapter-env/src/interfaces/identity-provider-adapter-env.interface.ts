export interface IIdentityProviderAdapterEnv {
  uid: string;
  name: string;
  title: string;
  active: boolean;
  display: boolean;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;
  discoveryUrl: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uris: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  post_logout_redirect_uris: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_types: string[];
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_signed_response_alg: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  token_endpoint_auth_method: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  revocation_endpoint_auth_method: string;
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
}
