/* istanbul ignore file */

// Tested by DTO
import { OidcAcrConfig } from '@fc/oidc-acr';

export default {
  // Higher is safer
  acrLevels: {
    eidas1: 1, // eIDAS Low
    eidas2: 2, // eIDAS Substantial
    eidas3: 3, // eIDAS High
  },
  defaultAcrValue: 'eidas2',
} as OidcAcrConfig;
