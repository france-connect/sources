import {
  RnippDeceasedException,
  RnippFoundOnlyWithMaritalNameException,
  RnippNotFoundMultipleEchoException,
  RnippNotFoundNoEchoException,
  RnippNotFoundSingleEchoException,
} from '@fc/rnipp';
import { IEventMap } from '@fc/tracking';

import { EventsCategories } from './enums';

export function getEventsMap(urlPrefix: string): IEventMap {
  return {
    // Front channel
    FC_AUTHORIZE_INITIATED: {
      step: '1.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_AUTHORIZE_INITIATED',
      exceptions: [],
      route: `${urlPrefix}/authorize`,
      intercept: false,
    },

    FC_SHOWED_IDP_CHOICE: {
      step: '2.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_SHOWED_IDP_CHOICE',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid`,
      intercept: true,
    },

    IDP_CHOSEN: {
      step: '3.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'IDP_CHOSEN',
      exceptions: [],
      route: `${urlPrefix}/redirect-to-idp`,
      intercept: true,
    },

    IDP_REQUESTED_FC_JWKS: {
      step: '3.1.0',
      category: EventsCategories.DISCOVERY,
      event: 'IDP_REQUESTED_FC_JWKS',
      exceptions: [],
      route: `${urlPrefix}/client/.well-known/jwks`,
      intercept: true,
    },

    IDP_CALLEDBACK: {
      step: '4.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'IDP_CALLEDBACK',
      exceptions: [],
      route: `${urlPrefix}/oidc-callback/:providerId`,
      intercept: true,
    },

    FC_REQUESTED_IDP_TOKEN: {
      step: '4.1.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REQUESTED_IDP_TOKEN',
      exceptions: [],
      route: `${urlPrefix}/oidc-callback/:providerId`,
      intercept: false,
    },

    FC_REQUESTED_IDP_USERINFO: {
      step: '4.2.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REQUESTED_IDP_USERINFO',
      exceptions: [],
      route: `${urlPrefix}/oidc-callback/:providerId`,
      intercept: false,
    },

    FC_REQUESTED_RNIPP: {
      step: '4.3.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REQUESTED_RNIPP',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_RECEIVED_RNIPP: {
      step: '4.4.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_RECEIVED_RNIPP',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_FAILED_RNIPP: {
      step: '4.4.1',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_FAILED_RNIPP',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_RECEIVED_VALID_RNIPP: {
      step: '4.4.2',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_RECEIVED_VALID_RNIPP',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_RECEIVED_DECEASED_RNIPP: {
      step: '4.4.3',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_RECEIVED_DECEASED_RNIPP',
      exceptions: [RnippDeceasedException],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_RECEIVED_INVALID_RNIPP: {
      step: '4.4.3',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_RECEIVED_INVALID_RNIPP',
      exceptions: [
        RnippNotFoundMultipleEchoException,
        RnippNotFoundNoEchoException,
        RnippNotFoundSingleEchoException,
        RnippFoundOnlyWithMaritalNameException,
      ],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: false,
    },

    FC_VERIFIED: {
      step: '5.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_VERIFIED',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/verify`,
      intercept: true,
    },

    FC_SHOWED_CONSENT: {
      step: '6.1.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_SHOWED_CONSENT',
      exceptions: [],
      route: `${urlPrefix}/interaction/:uid/consent`,
      intercept: true,
    },

    'FC_DATATRANSFER:INFORMATION:ANONYMOUS': {
      step: '6.2.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_DATATRANSFER:INFORMATION:ANONYMOUS',
      exceptions: [],
      route: `${urlPrefix}/login`,
      intercept: false,
    },

    'FC_DATATRANSFER:INFORMATION:IDENTITY': {
      step: '6.2.1',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_DATATRANSFER:INFORMATION:IDENTITY',
      exceptions: [],
      route: `${urlPrefix}/login`,
      intercept: false,
    },

    'FC_DATATRANSFER:CONSENT:IDENTITY': {
      step: '6.2.2',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_DATATRANSFER:CONSENT:IDENTITY',
      exceptions: [],
      route: `${urlPrefix}/login`,
      intercept: false,
    },

    FC_REDIRECTED_TO_SP: {
      step: '7.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'FC_REDIRECTED_TO_SP',
      exceptions: [],
      route: `${urlPrefix}/login`,
      intercept: true,
    },

    // Discovery
    SP_REQUESTED_FC_JWKS: {
      step: '7.1.0',
      category: EventsCategories.DISCOVERY,
      event: 'SP_REQUESTED_FC_JWKS',
      exceptions: [],
      route: `${urlPrefix}/jwks`,
      intercept: true,
    },

    // Back channel
    SP_REQUESTED_FC_TOKEN: {
      step: '7.2.0',
      category: EventsCategories.BACK_CINEMATIC,
      event: 'SP_REQUESTED_FC_TOKEN',
      exceptions: [],
      route: `${urlPrefix}/token`,
      intercept: false,
    },
    SP_REQUESTED_FC_USERINFO: {
      step: '7.3.0',
      category: EventsCategories.BACK_CINEMATIC,
      event: 'SP_REQUESTED_FC_USERINFO',
      exceptions: [],
      route: `${urlPrefix}/userinfo`,
      intercept: false,
    },

    // Not supported yet
    SP_REQUESTED_LOGOUT: {
      step: '8.0.0',
      category: EventsCategories.FRONT_CINEMATIC,
      event: 'SP_REQUESTED_LOGOUT',
      exceptions: [],
      route: `${urlPrefix}/session/end`,
      intercept: false,
    },
  };
}
