import { ConfigParser } from '@fc/config';
import { EudiPresentationId } from '@fc/eudi';
import {
  CONFIG_NAMESPACE,
  Openid4vpClientIdSchemeEnum,
  Openid4vpConfig,
  Openid4vpFormat,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '@fc/openid4vp';
import { Routes } from '@fc/wallet-bridge';

import App from './app';

const { urlPrefix, fqdn } = App;

const env = new ConfigParser<typeof CONFIG_NAMESPACE>(process.env, 'Openid4vp');

export default {
  relayingParty: {
    clientIdScheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
    clientId: env.string('CLIENT_ID'),
    responseUri: `https://${fqdn}${urlPrefix}${Routes.OPENID4VP_AUTHORIZE_RESPONSE}`,
    redirectUri: `https://${fqdn}${urlPrefix}${Routes.OPENID4VP_AUTHORIZE_REDIRECT}`,
    requestUri: `https://${fqdn}${urlPrefix}${Routes.OPENID4VP_AUTHORIZE_REQUEST_OBJECT}`,
    nonceLength: 32,
    stateLength: 32,
    interactionTtl: 600,
    responseDelay: 300,
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
        "$['eu.europa.ec.eudi.pid.1']['nationality']",
        "$['eu.europa.ec.eudi.pid.1']['expiry_date']",
        "$['eu.europa.ec.eudi.pid.1']['issuing_authority']",
        "$['eu.europa.ec.eudi.pid.1']['issuing_country']",
        "$['eu.europa.ec.eudi.pid.1']['age_over_18']",
        "$['eu.europa.ec.eudi.pid.1']['age_in_years']",
        "$['eu.europa.ec.eudi.pid.1']['age_birth_year']",
        "$['eu.europa.ec.eudi.pid.1']['trust_anchor']",
        "$['eu.europa.ec.eudi.pid.1']['birth_country']",
        "$['eu.europa.ec.eudi.pid.1']['birth_state']",
        "$['eu.europa.ec.eudi.pid.1']['birth_city']",
        "$['eu.europa.ec.eudi.pid.1']['resident_address']",
        "$['eu.europa.ec.eudi.pid.1']['resident_country']",
        "$['eu.europa.ec.eudi.pid.1']['resident_state']",
        "$['eu.europa.ec.eudi.pid.1']['resident_city']",
        "$['eu.europa.ec.eudi.pid.1']['resident_postal_code']",
        "$['eu.europa.ec.eudi.pid.1']['resident_street']",
        "$['eu.europa.ec.eudi.pid.1']['resident_house_number']",
        "$['eu.europa.ec.eudi.pid.1']['personal_administrative_number']",
        "$['eu.europa.ec.eudi.pid.1']['family_name_birth']",
        "$['eu.europa.ec.eudi.pid.1']['given_name_birth']",
        "$['eu.europa.ec.eudi.pid.1']['sex']",
        "$['eu.europa.ec.eudi.pid.1']['email_address']",
        "$['eu.europa.ec.eudi.pid.1']['mobile_phone_number']",
        "$['eu.europa.ec.eudi.pid.1']['issuance_date']",
        "$['eu.europa.ec.eudi.pid.1']['document_number']",
        "$['eu.europa.ec.eudi.pid.1']['issuing_jurisdiction']",
        "$['eu.europa.ec.eudi.pid.1']['location_status']",
      ],
      inputFieldPurpose: "Récupérer les données de la carte d'identité.",
      inputFieldIntentToRetain: false,
    },
  ],
} as Openid4vpConfig;
