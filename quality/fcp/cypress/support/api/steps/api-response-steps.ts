import { Then } from '@badeball/cypress-cucumber-preprocessor';

import { ApiErrorDto } from '../dto/api-error.dto';
import { validateDto } from '../helpers/class-validator-helper';

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
    cy.get('@apiResponse').its('headers').should('not.have.property', property);
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
  'le corps de la réponse a une propriété {string}',
  function (property: string) {
    cy.get('@apiResponse').its('body').should('have.property', property);
  },
);

Then(
  "le corps de la réponse n'a pas de propriété {string}",
  function (property: string) {
    cy.get('@apiResponse').its('body').should('not.have.property', property);
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

Then('le corps de la réponse contient un JWT', function () {
  cy.get('@apiResponse')
    .its('body')
    .then((body) => {
      expect(body).to.be.a('string');
      expect(body.length).to.be.greaterThan(500);
      cy.task('getJwtContent', { jwt: body }).then((jwtContent) => {
        const content = JSON.stringify(jwtContent, null, 2);
        cy.document().then((document) => {
          document.documentElement.innerHTML = content;
        });
        cy.get('body')
          .invoke('text')
          .then((json) => JSON.parse(json))
          .as('jwt');
      });
    });
});

Then('le corps de la réponse contient une erreur', function () {
  cy.get('@apiResponse')
    .its('body')
    .then(async (body) => {
      const errors = await validateDto(body, ApiErrorDto, {
        forbidNonWhitelisted: true,
        whitelist: true,
      });
      expect(errors, JSON.stringify(errors)).to.have.length(0);
    });
});
