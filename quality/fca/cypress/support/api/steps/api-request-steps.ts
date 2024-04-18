import { Given, When } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Request Steps
 *
 * Those steps prepare the step `je lance la requête`
 * They are followed by the response steps
 * from ./api-response-steps.ts
 */

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
