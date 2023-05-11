/* istanbul ignore file */

// Tested by DTO
import { RequestMethod } from '@nestjs/common';

import {
  EidasBridgeInvalidEUIdentityException,
  EidasBridgeInvalidFRIdentityException,
  EidasBridgeRoutes,
  EventsCategoriesEnum,
} from '@fc/eidas-bridge';
import { EidasClientRoutes } from '@fc/eidas-client';
import {
  EidasInvalidTokenChecksumException,
  EidasOversizedTokenException,
} from '@fc/eidas-light-protocol';
import { ReadLightRequestFromCacheException } from '@fc/eidas-provider';
import {
  OidcClientTokenFailedException,
  OidcClientUserinfosFailedException,
} from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { TrackingConfig } from '@fc/tracking';

const COUNTRY_CODE_FR = 'FR';

export default {
  eventsMap: {
    /**
     * FR Identity to EU SP REQUEST
     */
    INCOMING_EIDAS_REQUEST: {
      step: '1.0.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'INCOMING_EIDAS_REQUEST',
      countryCodeDst: COUNTRY_CODE_FR,
    },
    EIDAS_REQUEST_ERROR: {
      step: '1.1.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'EIDAS_REQUEST_ERROR',
      countryCodeDst: COUNTRY_CODE_FR,
      exceptions: [
        EidasInvalidTokenChecksumException,
        EidasOversizedTokenException,
        ReadLightRequestFromCacheException,
      ],
    },
    REDIRECT_TO_FC_AUTHORIZE: {
      step: '2.0.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'REDIRECT_TO_FC_AUTHORIZE',
      countryCodeDst: COUNTRY_CODE_FR,
      interceptRoutes: [
        {
          method: RequestMethod.GET,
          path: `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_FC_AUTHORIZE}`,
        },
      ],
    },
    RECEIVED_FC_AUTH_CODE: {
      step: '3.0.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'RECEIVED_FC_AUTH_CODE',
      countryCodeDst: COUNTRY_CODE_FR,
    },
    RECEIVED_FC_AUTH_ERROR: {
      step: '3.1.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'RECEIVED_FC_AUTH_ERROR',
      countryCodeDst: COUNTRY_CODE_FR,
    },
    RECEIVED_FC_TOKEN_ERROR: {
      step: '3.2.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'RECEIVED_FC_TOKEN_ERROR',
      countryCodeDst: COUNTRY_CODE_FR,
      exceptions: [OidcClientTokenFailedException],
    },
    RECEIVED_FC_USERINFO_ERROR: {
      step: '3.3.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'RECEIVED_FC_USERINFO_ERROR',
      countryCodeDst: COUNTRY_CODE_FR,
      exceptions: [OidcClientUserinfosFailedException],
    },
    OIDC_USERINFO_ERROR: {
      step: '3.4.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'OIDC_USERINFO_ERROR',
      countryCodeDst: COUNTRY_CODE_FR,
      exceptions: [EidasBridgeInvalidFRIdentityException],
    },
    REDIRECTING_TO_EIDAS_FR_NODE: {
      step: '4.0.0',
      category: EventsCategoriesEnum.EU_REQUEST,
      event: 'REDIRECTING_TO_EIDAS_FR_NODE',
      countryCodeDst: COUNTRY_CODE_FR,
    },

    /**
     * EU Identity to FR SP REQUEST
     */
    INCOMING_FC_REQUEST: {
      step: '1.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'INCOMING_FC_REQUEST',
      countryCodeSrc: COUNTRY_CODE_FR,
      interceptRoutes: [
        {
          path: OidcProviderRoutes.AUTHORIZATION,
          method: RequestMethod.GET,
        },
        {
          path: OidcProviderRoutes.AUTHORIZATION,
          method: RequestMethod.POST,
        },
      ],
    },
    DISPLAYING_CITIZEN_COUNTRY_CHOICE: {
      step: '1.1.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'DISPLAYING_CITIZEN_COUNTRY_CHOICE',
      countryCodeSrc: COUNTRY_CODE_FR,
      interceptRoutes: [
        {
          path: EidasBridgeRoutes.INTERACTION,
          method: RequestMethod.GET,
        },
      ],
    },
    SELECTED_CITIZEN_COUNTRY: {
      step: '1.2.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'SELECTED_CITIZEN_COUNTRY',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
    REDIRECTING_TO_FR_NODE: {
      step: '2.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'REDIRECTING_TO_FR_NODE',
      countryCodeSrc: COUNTRY_CODE_FR,
      interceptRoutes: [
        {
          path: `${EidasClientRoutes.BASE}${EidasClientRoutes.REDIRECT_TO_FR_NODE_CONNECTOR}`,
          method: RequestMethod.GET,
        },
      ],
    },
    INCOMING_EIDAS_RESPONSE: {
      step: '3.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'INCOMING_EIDAS_RESPONSE',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
    EIDAS_RESPONSE_ERROR: {
      step: '3.1.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'EIDAS_RESPONSE_ERROR',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
    EIDAS_IDENTITY_ERROR: {
      step: '3.2.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'EIDAS_IDENTITY_ERROR',
      countryCodeSrc: COUNTRY_CODE_FR,
      exceptions: [EidasBridgeInvalidEUIdentityException],
    },
    REDIRECT_TO_FC: {
      step: '4.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'REDIRECT_TO_FC',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
    RECEIVED_CALL_ON_TOKEN: {
      step: '5.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'RECEIVED_CALL_ON_TOKEN',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
    RECEIVED_CALL_ON_USERINFO: {
      step: '6.0.0',
      category: EventsCategoriesEnum.FR_REQUEST,
      event: 'RECEIVED_CALL_ON_USERINFO',
      countryCodeSrc: COUNTRY_CODE_FR,
    },
  },
} as TrackingConfig;
