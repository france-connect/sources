import { Before } from '@badeball/cypress-cucumber-preprocessor';

import { getDefaultUser } from '../../helpers';
import { UserData } from '../../types';

const setFixtureContext = (
  fixture: string,
  pathArray: string[],
  contextName: string,
): void => {
  cy.task('getFixturePath', { fixture, pathArray }).then(
    (fixturePath: string) => {
      cy.log(fixturePath);
      cy.fixture(fixturePath).as(contextName);
    },
  );
};

Before(function () {
  // Load environment config and test data
  const platform: string = Cypress.env('PLATFORM');
  const testEnv: string = Cypress.env('TEST_ENV');
  const pathArray = [platform, testEnv];
  setFixtureContext('environment.json', pathArray, 'env');
  setFixtureContext('users.json', pathArray, 'users');

  cy.get<UserData[]>('@users').then((users) => {
    this.user = getDefaultUser(users);
  });

  cy.intercept('GET', '/api/me').as('api:me');
});
