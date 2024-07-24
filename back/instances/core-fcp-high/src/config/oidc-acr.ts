/* istanbul ignore file */

// Tested by DTO
import { OidcAcrConfig } from '@fc/oidc-acr';

import OidcProvider from './oidc-provider';

export default {
  // Higher is safer
  knownAcrValues: {
    eidas1: 1, // eIDAS Low
    eidas2: 2, // eIDAS Substantial
    eidas3: 3, // eIDAS High
  },
  allowedAcrValues: OidcProvider.configuration.acrValues,
  defaultAcrValue: 'eidas3',
  allowedSsoAcrs: ['eidas2'],
} as OidcAcrConfig;
