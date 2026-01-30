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

import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

import { injectAxeFromQualityModules } from './common/helpers';

// Overwrite injectAxe because not supporting dependencies workspace
Cypress.Commands.overwrite('injectAxe', injectAxeFromQualityModules);

Cypress.Commands.add(
  'clearThenType',
  { prevSubject: 'element' },
  (subject, text, options = {}) => {
    cy.wrap(subject).trigger('keydown');
    cy.wrap(subject).invoke('val', text, options);
    // It is safe to chain those commands as there are no UI changes
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.wrap(subject).trigger('keyup').trigger('input').trigger('change');
  },
);

Cypress.Commands.addQuery(
  'checkWithinViewport',
  function (expectedWithinViewport: boolean) {
    const innerFn = (subject) => {
      const { bottom, left, right, top } = subject[0].getBoundingClientRect();
      const viewportWidth = subject[0].ownerDocument.defaultView.innerWidth;
      const viewportHeight = subject[0].ownerDocument.defaultView.innerHeight;

      const isWithinViewport =
        top < viewportHeight && bottom > 0 && left < viewportWidth && right > 0;

      expect(
        isWithinViewport,
        `element: top=${top} left=${left} right=${right} bottom=${bottom}, viewport: width=${viewportWidth} height=${viewportHeight}`,
      ).to.be.equal(expectedWithinViewport);
    };
    return innerFn;
  },
);

addMatchImageSnapshotCommand({
  blackout: [], // We use a custom blackout in image-snapshot-steps.ts
  capture: 'fullPage',
  customDiffConfig: { threshold: 0.3 },
  customDiffDir: './cypress/snapshots/diff',
  customSnapshotsDir: './cypress/snapshots/base',
  e2eSpecDir: 'cypress/integration/visuel',
  failureThreshold: 5,
  failureThresholdType: 'pixel',
});
