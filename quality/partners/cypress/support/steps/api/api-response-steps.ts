import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Response Steps
 *
 * Those steps follow the step `je lance la requête`
 * from ./api-request-steps.ts
 */

Then('le statut de la réponse est {int}', function (status: number) {
  cy.get('@apiResponse').its('status').should('equal', status);
});

Then(
  "l'entête de la réponse a une propriété {string} égale à {string}",
  function (property: string, value: string) {
    cy.get('@apiResponse').its('headers').its(property).should('equal', value);
  },
);

Then(
  "l'entête de la réponse a une propriété {string} contenant {string}",
  function (property: string, value: string) {
    cy.get('@apiResponse')
      .its('headers')
      .its(property)
      .should('include', value);
  },
);

Then(
  "l'entête de la réponse n'a pas de propriété {string}",
  function (property: string) {
    cy.get('@apiResponse').its('headers').its(property).should('not.exist');
  },
);

Then(
  'le corps de la réponse a une propriété {string} égale à {string}',
  function (property: string, value: string) {
    cy.get('@apiResponse').its('body').its(property).should('equal', value);
  },
);

Then(
  'le corps de la réponse a une propriété {string} égale à {int}',
  function (property: string, value: number) {
    cy.get('@apiResponse').its('body').its(property).should('equal', value);
  },
);

Then(
  /^le corps de la réponse a une propriété "([^"]+)" avec (\d+) éléments?$/,
  function (property: string, count: number) {
    cy.get('@apiResponse')
      .its('body')
      .its(property)
      .should('have.length', count);
  },
);

Then(
  /^le corps de la réponse a une propriété "([^"]+)" avec (\d+) attributs?$/,
  function (property: string, count: number) {
    cy.get('@apiResponse')
      .its('body')
      .its(property)
      .then((object) => Object.keys(object))
      .should('have.length', count);
  },
);

Then(
  'le corps de la réponse a une propriété {string}',
  function (property: string) {
    cy.get('@apiResponse').its('body').its(property).should('exist');
  },
);

Then(
  "le corps de la réponse n'a pas de propriété {string}",
  function (property: string) {
    cy.get('@apiResponse').its('body').its(property).should('not.exist');
  },
);

Given(
  'je mémorise la propriété {string} du corps de la réponse',
  function (property: string) {
    cy.get('@apiResponse')
      .its('body')
      .its(property)
      .should('exist')
      .as(`api:${property}`);
  },
);

Then(/^le corps de la réponse a (\d+) propriétés?$/, function (count: number) {
  cy.get('@apiResponse')
    .its('body')
    .should('exist')
    .then((body) => Object.keys(body))
    .should('have.length', count);
});

Then('le corps de la réponse contient une page web', function () {
  cy.get('@apiResponse')
    .its('body')
    .then((htmlBody) => {
      expect(htmlBody).to.be.a('string');
      expect(htmlBody).to.contain('<html');
      cy.document().then((document) => {
        document.documentElement.innerHTML = htmlBody;
      });
    });
});
