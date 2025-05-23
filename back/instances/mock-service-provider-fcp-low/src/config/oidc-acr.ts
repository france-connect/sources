import { OidcAcrConfig } from '@fc/oidc-acr';

export default {
  // Higher is safer
  knownAcrValues: {
    eidas1: 1, // eIDAS Low
    eidas2: 2, // eIDAS Substantial
    eidas3: 3, // eIDAS High
  },
  allowedAcrValues: [], // UD is not an identity provider
  defaultAcrValue: 'eidas1',
} as OidcAcrConfig;
