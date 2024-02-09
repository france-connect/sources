export interface IIdentityProviderAdapterEnv {
  uid: string;
  name: string;
  title: string;
  active: boolean;
  display: boolean;
  discoveryUrl: string;
  issuer: {
    issuer?: string;
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    authorization_endpoint?: string;
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint?: string;
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_endpoint?: string;
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    end_session_endpoint?: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: string;
  };
  client: {
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: string;
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
    id_token_encrypted_response_alg?: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc?: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_signed_response_alg?: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_alg?: string;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_enc?: string;
  };
}
