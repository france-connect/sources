import { Given, Step, When } from '@badeball/cypress-cucumber-preprocessor';

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
  "je retire {string} de l'entête de la requête",
  function (property: string) {
    expect(this.apiRequest.headers[property]).to.exist;
    delete this.apiRequest.headers[property];
  },
);

Given(
  "je mets la valeur {string} dans l'entête {string} de la requête",
  function (value: string, property: string) {
    this.apiRequest.headers[property] = value;
  },
);

Given(
  "je mets la donnée mémorisée {string} dans la propriété {string} de l'entête de la requête",
  function (dataKey: string, property: string) {
    cy.get(`@api:${dataKey}`)
      .should('exist')
      .then((value) => {
        this.apiRequest.headers[property] = value;
      });
  },
);

Given(
  "je mets le chemin {string} dans l'url de la requête",
  function (pathname: string) {
    const url = new URL(this.apiRequest.url);
    url.pathname = pathname;
    this.apiRequest.url = url.toString();
  },
);

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
  'je mets la donnée mémorisée {string} dans la propriété {string} du corps de la requête',
  function (dataKey: string, property: string) {
    cy.get(`@api:${dataKey}`)
      .should('exist')
      .then((value) => {
        this.apiRequest.body[property] = value;
      });
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

When('je lance la requête avec le csrf-token', function () {
  // Backup the current request preparation
  const currentRequest = { ...this.apiRequest };

  // Retrieve the csrf-token
  Step(this, 'je prépare une requête "csrf-token"');
  Step(this, 'je lance la requête');
  Step(this, 'je mémorise la propriété "csrfToken" du corps de la réponse');

  // Restore current request context
  cy.wrap(currentRequest).as('apiRequest');
  // Add csrf-token to the request headers
  Step(
    this,
    `je mets la donnée mémorisée "csrfToken" dans la propriété "x-csrf-token" de l'entête de la requête`,
  );

  Step(this, 'je lance la requête');
});
