/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import {
  OidcProviderConfig,
  OidcProviderPrompt,
  OidcProviderRoutes,
} from '@fc/oidc-provider';

const env = new ConfigParser(process.env, 'OidcProvider');

export default {
  forcedPrompt: [OidcProviderPrompt.LOGIN, OidcProviderPrompt.CONSENT],
  prefix: env.string('PREFIX'),
  issuer: env.string('ISSUER'),
  defaultAcrValue: 'eidas3',
  knownAcrValues: ['eidas1', 'eidas2', 'eidas3'],
  configuration: {
    routes: {
      authorization: OidcProviderRoutes.AUTHORIZATION,
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      check_session: OidcProviderRoutes.CHECK_SESSION,
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      code_verification: OidcProviderRoutes.CODE_VERIFICATION,
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      device_authorization: OidcProviderRoutes.DEVICE_AUTHORIZATION,
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      end_session: OidcProviderRoutes.END_SESSION,
      introspection: OidcProviderRoutes.INTROSPECTION,
      jwks: OidcProviderRoutes.JWKS,
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      pushed_authorization_request:
        OidcProviderRoutes.PUSHED_AUTHORIZATION_REQUEST,
      registration: OidcProviderRoutes.REGISTRATION,
      revocation: OidcProviderRoutes.REVOCATION,
      token: OidcProviderRoutes.TOKEN,
      userinfo: OidcProviderRoutes.USERINFO,
    },
    subjectTypes: ['pairwise'],
    cookies: {
      keys: env.json('COOKIES_KEYS'),
      long: {
        sameSite: 'lax',
        signed: true,
        path: '/',
      },
      short: {
        sameSite: 'lax',
        signed: true,
        path: '/',
      },
    },
    // node-oidc-provider defined key
    // eslint-disable-next-line @typescript-eslint/naming-convention
    grant_types_supported: ['authorization_code'],
    features: {
      devInteractions: { enabled: false },
      encryption: { enabled: true },
      jwtUserinfo: { enabled: true },
      backchannelLogout: { enabled: true },
      revocation: { enabled: true },
      rpInitiatedLogout: { enabled: true },
    },
    acceptQueryParamAccessTokens: true,
    ttl: {
      AccessToken: 60, // 1 minute
      AuthorizationCode: 30, // 30 seconds
      IdToken: 60, // 1 minute
      Interaction: 600, // 10 minutes
      Session: 600, // 10 minutes
    },
    acrValues: ['eidas2', 'eidas3'],
    scopes: ['openid'],
    claims: {
      openid: ['sub'],
      gender: ['gender'],
      birthdate: ['birthdate'],
      birthcountry: ['birthcountry'],
      birthplace: ['birthplace'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: ['given_name'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: ['family_name'],
      email: ['email'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      preferred_username: ['preferred_username'],
      address: ['address'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      phone: ['phone_number'],
      profile: [
        'sub',
        'given_name',
        'family_name',
        'birthdate',
        'gender',
        'birthplace',
        'birthcountry',
        'preferred_username',
      ],
    },
    clientDefaults: {
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      grant_types: ['authorization_code'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg: 'ES256',
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_types: ['code'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_endpoint_auth_method: 'client_secret_post',
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      application_type: 'web',
    },
    responseTypes: ['code'],
    revocationEndpointAuthMethods: ['client_secret_post', 'private_key_jwt'],
    tokenEndpointAuthMethods: ['client_secret_post', 'private_key_jwt'],
    enabledJWA: {
      authorizationEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      authorizationEncryptionEncValues: ['A256GCM'],
      authorizationSigningAlgValues: ['ES256'],
      dPoPSigningAlgValues: ['ES256'],
      idTokenEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      idTokenEncryptionEncValues: ['A256GCM'],
      idTokenSigningAlgValues: ['ES256'],
      introspectionEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      introspectionEncryptionEncValues: ['A256GCM'],
      introspectionEndpointAuthSigningAlgValues: ['ES256'],
      introspectionSigningAlgValues: ['ES256'],
      requestObjectEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      requestObjectEncryptionEncValues: ['A256GCM'],
      requestObjectSigningAlgValues: ['ES256'],
      revocationEndpointAuthSigningAlgValues: ['ES256'],
      tokenEndpointAuthSigningAlgValues: ['ES256'],
      userinfoEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      userinfoEncryptionEncValues: ['A256GCM'],
      userinfoSigningAlgValues: ['ES256'],
    },
    jwks: {
      keys: [env.json('CRYPTO_SIG_FAKE_PRIV_KEY')],
    },

    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
} as OidcProviderConfig;
