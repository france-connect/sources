import { createHash } from 'crypto';

import { Then } from 'cypress-cucumber-preprocessor/steps';

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
];
const blackoutDiv = (width) => {
  const style = width ? ` style="width: ${width}px"` : '';
  return `<div class="blackout"${style}></div>`;
};

const addBlackoutMethods = () => {
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = `.blackout { background-color: black !important; }
       .blackout * { color: black !important; }`;
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
    addBlackoutMethods();
    cy.matchImageSnapshot(snapshotName(scenarioName, name, device));
  },
);

Then(
  "la copie d'écran {string} correspond à l'élément web {string} sur {string}",
  function (name, selector, device) {
    const { title: scenarioName } = this.test;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(750);
    addBlackoutMethods();
    cy.get(selector).then(($el) =>
      cy.wrap($el).matchImageSnapshot(snapshotName(scenarioName, name, device)),
    );
  },
);
