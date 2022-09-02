import { Given, When } from 'cypress-cucumber-preprocessor/steps';

import { clearAllCookies } from '../helpers';

Given('je supprime tous les cookies', function () {
  clearAllCookies();
});

When(/^je rafraîchis la page$/, function () {
  cy.reload();
  cy.waitForNetworkIdle('/api', 500);
});
