import { Then } from '@badeball/cypress-cucumber-preprocessor';

const prepareScreenshot = () => {
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = 'body { caret-color: transparent !important; }';
    doc.head.appendChild(style);
  });
};

const createScenarioHash = (
  scenarioName: string,
): Cypress.Chainable<string> => {
  const scenarioTrimmed = scenarioName.trim().toLowerCase();
  return cy.task<string>('createHexaHash', { text: scenarioTrimmed });
};

const getSnapshotName = (
  scenarioName: string,
  name: string,
  device: string,
): Cypress.Chainable<string> => {
  return createScenarioHash(scenarioName).then(
    (scenarioHash) => `${scenarioHash}_${name}_${device}`,
  );
};

Then(
  "la copie d'écran {string} correspond à la page actuelle sur {string}",
  function (name: string, device: string) {
    const { title: scenarioName } = this.test;
    // Wait for the page to be still before taking a screenshot
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);
    prepareScreenshot();
    getSnapshotName(scenarioName, name, device).then((snapshotName) =>
      cy.matchImageSnapshot(snapshotName),
    );
  },
);

Then(
  "la copie d'écran {string} correspond à l'élément web {string} sur {string}",
  function (name: string, selector: string, device: string) {
    const { title: scenarioName } = this.test;
    // Wait for the page to be still before taking a screenshot
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);
    prepareScreenshot();
    getSnapshotName(scenarioName, name, device).then((snapshotName) =>
      cy.get(selector).matchImageSnapshot(snapshotName),
    );
  },
);

Then(
  "la copie d'écran {string} sans {string} correspond à la page actuelle sur {string}",
  function (name: string, hiddenSelector: string, device: string) {
    const { title: scenarioName } = this.test;
    // Wait for the page to be still before taking a screenshot
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);

    prepareScreenshot();
    // @todo Replace with blackout config when this Cypress defect is fixed
    // @link https://github.com/cypress-io/cypress/issues/5842
    const blackoutStyle = 'color: black; background-color: black;';
    cy.get(hiddenSelector).invoke('attr', 'style', blackoutStyle);
    getSnapshotName(scenarioName, name, device).then((snapshotName) =>
      cy.matchImageSnapshot(snapshotName),
    );
    cy.get(hiddenSelector).invoke('attr', 'style', '');
  },
);
