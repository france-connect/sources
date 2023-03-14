/* istanbul ignore file */

// Tested by DTO
import { RequestMethod } from '@nestjs/common';

import { CoreRoutes } from '@fc/core';
import { EventsCategories } from '@fc/core-fcp';
import { OidcClientRoutes } from '@fc/oidc-client';
import { TrackingConfig } from '@fc/tracking';

export default {
  eventsMap: {
    FC_AUTHORIZE_INITIATED: {
      step: '1.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_AUTHORIZE_INITIATED',
    },

    FC_SSO_INITIATED: {
      step: '1.1.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_SSO_INITIATED',
    },

    FC_SHOWED_IDP_CHOICE: {
      step: '2.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_SHOWED_IDP_CHOICE',
      interceptRoutes: [
        { method: RequestMethod.GET, path: CoreRoutes.INTERACTION },
      ],
    },

    IDP_CHOSEN: {
      step: '3.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'IDP_CHOSEN',
      interceptRoutes: [
        { method: RequestMethod.POST, path: OidcClientRoutes.REDIRECT_TO_IDP },
      ],
    },

    IDP_REQUESTED_FC_JWKS: {
      step: '3.1.0',
      category: EventsCategories.DISCOVERY,
      event: 'IDP_REQUESTED_FC_JWKS',
      interceptRoutes: [
        { method: RequestMethod.GET, path: OidcClientRoutes.WELL_KNOWN_KEYS },
      ],
    },

    IDP_CALLEDBACK: {
      step: '4.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'IDP_CALLEDBACK',
    },

    FC_REQUESTED_IDP_TOKEN: {
      step: '4.1.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REQUESTED_IDP_TOKEN',
    },

    FC_REQUESTED_IDP_USERINFO: {
      step: '4.2.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REQUESTED_IDP_USERINFO',
    },

    FC_VERIFIED: {
      step: '5.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_VERIFIED',
    },

    FC_BLACKLISTED: {
      step: '5.1.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_SSO_UNAUTHORIZED_IDP',
    },

    FC_REDIRECTED_TO_SP: {
      step: '7.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REDIRECTED_TO_SP',
      interceptRoutes: [
        { method: RequestMethod.GET, path: CoreRoutes.INTERACTION_LOGIN },
      ],
    },

    // Discovery
    SP_REQUESTED_FC_JWKS: {
      step: '7.1.0',
      category: EventsCategories.DISCOVERY,
      event: 'SP_REQUESTED_FC_JWKS',
      interceptRoutes: [
        { method: RequestMethod.GET, path: CoreRoutes.JWKS_URI },
      ],
    },

    SP_REQUESTED_FC_TOKEN: {
      step: '7.2.0',
      category: EventsCategories.BACK_CINEMATIC,
      event: 'SP_REQUESTED_FC_TOKEN',
    },
    SP_REQUESTED_FC_USERINFO: {
      step: '7.3.0',
      category: EventsCategories.BACK_CINEMATIC,
      event: 'SP_REQUESTED_FC_USERINFO',
    },

    // Not implemented yet
    SP_REQUESTED_LOGOUT: {
      step: '8.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'SP_REQUESTED_LOGOUT',
    },
  },
} as TrackingConfig;
