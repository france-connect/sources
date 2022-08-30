// Stryker disable all
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
  issuer: `https://${process.env.FQDN}${env.string('PREFIX')}`,
  defaultAcrValue: 'eidas1',
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
      encryption: { enabled: false },
      jwtUserinfo: { enabled: true },
      backchannelLogout: { enabled: true },
      revocation: { enabled: true },
      rpInitiatedLogout: { enabled: true },
      claimsParameter: { enabled: true },
    },
    acceptQueryParamAccessTokens: true,
    ttl: {
      AccessToken: 60, // 1 minute
      AuthorizationCode: 30, // 30 seconds
      IdToken: 60, // 1 minute
      Interaction: 600, // 10 minutes
      Session: 600, // 10 minutes
    },
    acrValues: ['eidas1'],
    scopes: ['openid'],
    claims: {
      amr: ['amr'],
      uid: ['uid'],
      openid: ['sub'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: ['given_name'],
      email: ['email'],
      phone: ['phone_number'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      organizational_unit: ['organizational_unit'],
      siren: ['siren'],
      siret: ['siret'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      usual_name: ['usual_name'],
      // node-oidc-provider defined key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      belonging_population: ['belonging_population'],
      chorusdt: ['chorusdt:matricule', 'chorusdt:societe'],
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_id: ['idp_id'],
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_acr: ['idp_acr'],
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
      authorizationSigningAlgValues: ['ES256', 'RS256', 'HS256'],
      dPoPSigningAlgValues: ['ES256', 'RS256'],
      idTokenEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      idTokenEncryptionEncValues: ['A256GCM'],
      idTokenSigningAlgValues: ['ES256', 'RS256', 'HS256'],
      introspectionEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      introspectionEncryptionEncValues: ['A256GCM'],
      introspectionEndpointAuthSigningAlgValues: ['ES256', 'RS256'],
      introspectionSigningAlgValues: ['ES256', 'RS256', 'HS256'],
      requestObjectEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      requestObjectEncryptionEncValues: ['A256GCM'],
      requestObjectSigningAlgValues: ['ES256', 'RS256', 'HS256'],
      revocationEndpointAuthSigningAlgValues: ['ES256', 'RS256'],
      tokenEndpointAuthSigningAlgValues: ['ES256', 'RS256'],
      userinfoEncryptionAlgValues: ['ECDH-ES', 'RSA-OAEP'],
      userinfoEncryptionEncValues: ['A256GCM'],
      userinfoSigningAlgValues: ['ES256', 'RS256', 'HS256'],
    },
    jwks: {
      keys: [
        env.json('CRYPTO_SIG_ES256_PRIV_KEY'),
        env.json('CRYPTO_SIG_RS256_PRIV_KEY'),
      ],
    },

    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
} as OidcProviderConfig;
