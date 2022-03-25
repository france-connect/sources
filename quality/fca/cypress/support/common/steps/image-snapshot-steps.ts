import { createHash } from 'crypto';

import { Then } from 'cypress-cucumber-preprocessor/steps';

const createScenarioHash = (scenarioName: string): string => {
  const scenarioTrimmed = scenarioName.trim().toLowerCase();
  const hash = createHash('sha512').update(scenarioTrimmed).digest('hex');
  return hash.substring(0, 10);
};

const snapshotName = (scenarioName, name, device) => {
  const scenarioHash = createScenarioHash(scenarioName);
  return `${scenarioHash}_${name}_${device}`;
};

Then(
  "la copie d'écran {string} correspond à la page actuelle sur {string}",
  function (name, device) {
    const { title: scenarioName } = this.test;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);
    cy.matchImageSnapshot(snapshotName(scenarioName, name, device));
  },
);

Then(
  "la copie d'écran {string} correspond à l'élément web {string} sur {string}",
  function (name, selector, device) {
    const { title: scenarioName } = this.test;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);
    cy.get(selector).then(($el) =>
      cy.wrap($el).matchImageSnapshot(snapshotName(scenarioName, name, device)),
    );
  },
);

Then(
  "la copie d'écran {string} sans {string} correspond à la page actuelle sur {string}",
  function (name, hiddenSelector, device) {
    const { title: scenarioName } = this.test;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);

    // @todo Replace with blackout config when this Cypress defect is fixed
    // @link https://github.com/cypress-io/cypress/issues/5842
    const blackoutStyle = 'color: black; background-color: black;';
    cy.get(hiddenSelector).invoke('attr', 'style', blackoutStyle);
    cy.matchImageSnapshot(snapshotName(scenarioName, name, device));
    cy.get(hiddenSelector).invoke('attr', 'style', '');
  },
);
