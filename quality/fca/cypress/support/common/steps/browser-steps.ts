import { When } from 'cypress-cucumber-preprocessor/steps';

When(/^je rafraîchis la page$/, function () {
  cy.reload();
  cy.waitForNetworkIdle('/api', 500);
});
