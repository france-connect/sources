import { Result } from 'axe-core';

/**
 * Override function for injectAxe
 * with node_modules folder in /quality
 * @link https://github.com/component-driven/cypress-axe/blob/master/src/index.ts
 */
export const injectAxeFromQualityModules = (): void => {
  const fileName = '../node_modules/axe-core/axe.min.js';
  cy.readFile<string>(fileName).then((source) =>
    cy.window({ log: false }).then((window) => {
      window.eval(source);
    }),
  );
};

const severityIndicators = {
  critical: '🔴',
  minor: '⚪️',
  moderate: '🟡',
  serious: '🟠',
};

/**
 * Display the accessibility violations in Cypress UI
 * @param violations array of results returned by Axe
 * @link https://github.com/jonoliver/cypress-axe-demo/blob/after-a11y-fixes/cypress/support/commands.js
 */
export const cypressLog = (violations: Result[]): void => {
  violations.forEach((violation) => {
    const targets = violation.nodes.map(({ target }) => target);
    const nodes = Cypress.$(targets.join(','));
    const consoleProps = () => violation;

    Cypress.log({
      $el: nodes,
      consoleProps,
      message: `[${violation.help}](${violation.helpUrl})`,
      name: `${severityIndicators[violation.impact]} A11Y`,
    });

    targets.forEach((target) => {
      const el = Cypress.$(target.join(','));

      Cypress.log({
        $el: el,
        consoleProps,
        message: target,
        name: '🔧',
      });
    });
  });
};

/**
 * Display the accessibility violation table in the terminal
 * @param violations array of results returned by Axe
 * @link https://github.com/component-driven/cypress-axe#in-your-spec-file
 */
export const terminalLog = (violations: Result[]): void => {
  const isPlural = violations.length > 1;
  cy.task(
    'log',
    `${violations.length} accessibility violation${isPlural ? 's' : ''} ${
      isPlural ? 'were' : 'was'
    } detected`,
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ description, id, impact, nodes }) => ({
      description,
      id,
      impact,
      nodes: nodes.length,
    }),
  );

  cy.task('table', violationData);
};

/**
 * Display the violations in both cypress and terminal logs
 * @param violations array of results returned by Axe
 */
export const displayViolations = (violations: Result[]): void => {
  cypressLog(violations);
  terminalLog(violations);
};
