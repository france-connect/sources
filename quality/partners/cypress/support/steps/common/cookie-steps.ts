import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('je supprime tous les cookies', function () {
  cy.clearAllCookies();
});
