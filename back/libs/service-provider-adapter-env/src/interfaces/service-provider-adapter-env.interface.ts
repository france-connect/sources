export interface IServiceProviderAdapterEnv {
  active: boolean;
  name: string;
  title: string;
  key: string;
  client_secret: string;
  scopes: string[];
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  id_token_signed_response_alg: string;
  id_token_encrypted_response_alg: string;
  id_token_encrypted_response_enc: string;
  userinfo_signed_response_alg: string;
  userinfo_encrypted_response_alg: string;
  userinfo_encrypted_response_enc: string;
  jwks_uri: string;
}
