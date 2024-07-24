import { Given, When } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Request Steps
 *
 * Those steps prepare the step `je lance la requête`
 * They are followed by the response steps
 * from ./api-response-steps.ts
 */

Given('je prépare une requête {string}', function (requestKey: string) {
  this.apiRequest = this.apiRequests[requestKey];
  expect(this.apiRequest).to.exist;
});

Given(
  'je retire le paramètre {string} de la requête',
  function (property: string) {
    expect(this.apiRequest.qs[property]).to.exist;
    delete this.apiRequest.qs[property];
  },
);

Given(
  'je mets {string} dans le paramètre {string} de la requête',
  function (value: string, property: string) {
    this.apiRequest.qs[property] = value;
  },
);

Given('je retire {string} du corps de la requête', function (property: string) {
  expect(this.apiRequest.body[property]).to.exist;
  delete this.apiRequest.body[property];
});

Given(
  'je mets {string} dans la propriété {string} du corps de la requête',
  function (value: string, property: string) {
    this.apiRequest.body[property] = value;
  },
);

Given(
  'je configure la requête pour ne pas suivre les redirections',
  function () {
    this.apiRequest.followRedirect = false;
  },
);

When('je lance la requête', function () {
  const requestOptions: Partial<Cypress.RequestOptions> = {
    ...this.apiRequest,
    failOnStatusCode: false,
  };
  cy.api(requestOptions).as('apiResponse');
});
