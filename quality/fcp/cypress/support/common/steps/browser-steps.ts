import { Given, When } from 'cypress-cucumber-preprocessor/steps';

import { clearAllCookies } from '../helpers';

Given('je supprime tous les cookies', function () {
  clearAllCookies();
});

When(/^je rafraîchis la page$/, function () {
  cy.reload();
  // Need to wait for the page after refresh
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});
