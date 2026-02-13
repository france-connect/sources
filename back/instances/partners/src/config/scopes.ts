import {
  ants,
  cnafMsa,
  cnam,
  cnous,
  dgfip,
  dsnj,
  dss,
  fcpLow,
  ft,
  mesri,
  ScopesConfig,
} from '@fc/scopes';

const config: ScopesConfig = {
  mapping: [cnam, cnous, dgfip, fcpLow, mesri, ft, cnafMsa, dss, dsnj, ants],
};

export default config;
