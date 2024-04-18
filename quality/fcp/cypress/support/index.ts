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
import 'cypress-maildev';
import 'cypress-plugin-api';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

import { injectAxeFromQualityModules } from './common/helpers';

// Overwrite injectAxe because not supporting dependencies workspace
Cypress.Commands.overwrite('injectAxe', injectAxeFromQualityModules);

Cypress.Commands.add(
  'clearThenType',
  { prevSubject: 'element' },
  // Force Cypress to accept chaining clear and type commands
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  (subject, text, options) => cy.wrap(subject).clear().type(text, options),
);

addMatchImageSnapshotCommand({
  blackout: [], // We use a custom blackout in image-snapshot-steps.ts
  capture: 'fullPage',
  customDiffConfig: { threshold: 0.3 },
  customDiffDir: './cypress/snapshots/diff',
  customSnapshotsDir: './cypress/snapshots/base',
  failureThreshold: 5,
  failureThresholdType: 'pixel',
});
