import {
  cnafMsa,
  cnam,
  cnous,
  dgfip,
  dss,
  fcpLow,
  ft,
  mesri,
  mi,
  ScopesConfig,
} from '@fc/scopes';

const config: ScopesConfig = {
  mapping: [cnam, cnous, dgfip, fcpLow, mesri, mi, ft, cnafMsa, dss],
};

export default config;
