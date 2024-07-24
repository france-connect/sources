export interface IIdentityProviderAdapterEnv {
  uid: string;
  name: string;
  title: string;
  active: boolean;
  display: boolean;
  discoveryUrl: string;
  issuer: {
    issuer?: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    userinfo_endpoint?: string;
    end_session_endpoint?: string;
    jwks_uri: string;
  };
  client: {
    client_id: string;
    client_secret: string;
    response_types: string[];
    id_token_signed_response_alg: string;
    token_endpoint_auth_method: string;
    revocation_endpoint_auth_method: string;
    id_token_encrypted_response_alg?: string;
    id_token_encrypted_response_enc?: string;
    userinfo_signed_response_alg?: string;
    userinfo_encrypted_response_alg?: string;
    userinfo_encrypted_response_enc?: string;
  };
}
