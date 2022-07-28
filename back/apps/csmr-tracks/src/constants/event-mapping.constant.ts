/* istanbul ignore file */

// Declarative code
export const EVENT_MAPPING = {
  'authentication/initial': 'FC_VERIFIED',
  'consent/demandeIdentity': 'FC_DATATRANSFER_CONSENT_IDENTITY',
  'consent/demandeData': 'FC_DATATRANSFER_CONSENT_DATA',
  'checkedToken/verification': 'DP_REQUESTED_FC_CHECKTOKEN',
};
