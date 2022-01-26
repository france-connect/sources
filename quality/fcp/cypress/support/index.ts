// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-axe';
import 'cypress-xpath';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

import { injectAxeFromQualityModules } from './common/helpers';

// Overwrite injectAxe because not supporting dependencies workspace
Cypress.Commands.overwrite('injectAxe', injectAxeFromQualityModules);

addMatchImageSnapshotCommand({
  blackout: [
    '#error-id', // ignore FranceConnect Session Id on error page
  ],
  capture: 'fullPage',
  customDiffConfig: { threshold: 0.3 },
  customDiffDir: './cypress/snapshots/diff',
  customSnapshotsDir: './cypress/snapshots/base',
  failureThreshold: 0,
  failureThresholdType: 'percent',
});
