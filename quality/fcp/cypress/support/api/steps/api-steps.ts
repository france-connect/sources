import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { ApiErrorDto } from '../dto/api-error.dto';
import { validateDto } from '../helpers/class-validator-helper';

Given('je prépare une requête {string}', function (requestKey: string) {
  const platform: string = Cypress.env('PLATFORM');
  const testEnv: string = Cypress.env('TEST_ENV');
  const pathArray = [platform, testEnv];
  const fixture = 'api-common.json';
  cy.task('getFixturePath', { fixture, pathArray }).then(
    (fixturePath: string) => {
      cy.log(fixturePath);
      cy.fixture(fixturePath).then((requests) => {
        expect(requests[requestKey]).to.be.ok;
        this.requestOptions = requests[requestKey];
      });
    },
  );
});

Given(
  'je retire le paramètre {string} de la requête',
  function (property: string) {
    expect(this.requestOptions.qs[property]).to.exist;
    delete this.requestOptions.qs[property];
  },
);

Given(
  'je mets {string} dans le paramètre {string} de la requête',
  function (value: string, property: string) {
    this.requestOptions.qs[property] = value;
  },
);

Given('je retire {string} du corps de la requête', function (property: string) {
  expect(this.requestOptions.body[property]).to.exist;
  delete this.requestOptions.body[property];
});

Given(
  'je mets {string} dans la propriété {string} du corps de la requête',
  function (value: string, property: string) {
    this.requestOptions.body[property] = value;
  },
);

Given(
  'je configure la requête pour ne pas suivre les redirections',
  function () {
    this.requestOptions.followRedirect = false;
  },
);

When('je lance la requête', function () {
  const requestOptions: Partial<Cypress.RequestOptions> = {
    ...this.requestOptions,
    failOnStatusCode: false,
  };
  cy.api(requestOptions).as('apiResponse');
});

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
  "l'entête de la réponse n'a pas une propriété {string}",
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
  "le corps de la réponse n'a pas une propriété {string}",
  function (property: string) {
    cy.get('@apiResponse').its('body').should('not.have.property', property);
  },
);

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
