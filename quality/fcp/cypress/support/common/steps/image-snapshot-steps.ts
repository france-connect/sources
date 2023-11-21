import { Then } from '@badeball/cypress-cucumber-preprocessor';

// Custom blackout methods
const blackout = [
  { selector: '#error-id' },
  { selector: '#tracks-list h2', width: 200 },
  {
    selector:
      '#tracks-list button [data-testid="TrackCardHeaderComponent-connection-date-label"]',
    width: 175,
  },
  {
    selector:
      '#tracks-list button [data-testid="ConnectionComponent-connection-datetime-label"]',
    width: 275,
  },
  {
    selector: '#tracks-list button [data-testid="ClaimsComponent-date-label"]',
    width: 275,
  },
  {
    selector: '[data-testid="updateidpsettings-date"]',
    width: 275,
  },
  {
    selector: '[data-testid="connection-notification-message"]',
  },
];
const blackoutDiv = (width) => {
  const style = width ? ` style="width: ${width}px"` : '';
  return `<div class="blackout"${style}></div>`;
};

const prepareScreenshot = () => {
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = `.blackout { background-color: black !important; }
       .blackout * { color: black !important; }
       body { caret-color: transparent !important; }`;
    doc.head.appendChild(style);
  });
  Cypress.Screenshot.defaults({
    onAfterScreenshot($el) {
      $el.find('.blackout').children().first().unwrap();
    },
    onBeforeScreenshot($el) {
      blackout.forEach(({ selector, width }) => {
        const $elementToBlackout = $el.find(selector);
        if ($elementToBlackout) {
          $elementToBlackout.wrap(blackoutDiv(width));
        }
      });
    },
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
