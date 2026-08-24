import { ConfigParser } from '@fc/config';
import { EudiPresentationId } from '@fc/eudi';
import {
  CONFIG_NAMESPACE,
  Openid4vpConfig,
  Openid4vpFormat,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '@fc/openid4vp';
import { WalletBridgeRoutes } from '@fc/wallet-bridge';

import App from './app';

const { urlPrefix, fqdn } = App;

const env = new ConfigParser<typeof CONFIG_NAMESPACE>(process.env, 'Openid4vp');

export default {
  relayingParty: {
    clientIdScheme: env.string('CLIENT_ID_SCHEME'),
    clientId: env.string('CLIENT_ID'),
    responseUri: `https://${fqdn}${urlPrefix}${WalletBridgeRoutes.OPENID4VP_AUTHORIZE_RESPONSE}`,
    redirectUri: `https://${fqdn}${urlPrefix}${WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REDIRECT}`,
    requestUri: `https://${fqdn}${urlPrefix}${WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_OBJECT}`,
    nonceLength: 32,
    stateLength: 32,
    interactionTtl: 600,
    responseDelay: 300,
    redirectDelay: 2,
    clientMetadata: {
      token_endpoint_auth_method: 'none',
      authorization_encrypted_response_alg: 'ECDH-ES',
      authorization_encrypted_response_enc: 'A256GCM',
      formats: {
        mso_mdoc: {
          alg: [
            'ES256',
            'ES384',
            'ES512',
            'ESB256',
            'ESB320',
            'ESB384',
            'ESB512',
          ],
        },
      },
    },
  },

  x509: {
    certificateChainPem: env.file('X509_CERTIFICATE_CHAIN'),
    privateKeyPem: env.file('X509_PRIVATE_KEY'),
    alg: env.string('X509_ALG'),
  },

  jwks: {
    keys: env.json('JWKS'),
  },

  requests: [
    {
      presentationId: EudiPresentationId.PID_FC,
      format: Openid4vpFormat.JWT,
      responseType: Openid4vpResponseType.VP_TOKEN,
      responseMode: Openid4vpResponseMode.DIRECT_POST_JWT,
      inputDescriptorId: 'eu.europa.ec.eudi.pid.1',
      inputFieldPaths: [
        "$['eu.europa.ec.eudi.pid.1']['family_name']",
        "$['eu.europa.ec.eudi.pid.1']['given_name']",
        "$['eu.europa.ec.eudi.pid.1']['birth_date']",
        "$['eu.europa.ec.eudi.pid.1']['birth_place']",
        "$['eu.europa.ec.eudi.pid.1']['sex']",
        "$['eu.europa.ec.eudi.pid.1']['email_address']",
      ],
      inputFieldPurpose: "Récupérer les données de la carte d'identité.",
      inputFieldIntentToRetain: false,
    },
  ],
} as Openid4vpConfig;
