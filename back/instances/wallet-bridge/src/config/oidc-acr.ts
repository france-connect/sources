import { OidcAcrConfig } from '@fc/oidc-acr';

import OidcProvider from './oidc-provider';

export default {
  // @TODO #2632 #2624 Refine ACR values mapping according to EUDI wallet interaction requirements
  knownAcrValues: {
    eidas1: 1,
    eidas2: 2,
    eidas3: 3,
  },
  allowedAcrValues: OidcProvider.configuration.acrValues,
  defaultAcrValue: 'eidas3',
} as OidcAcrConfig;
