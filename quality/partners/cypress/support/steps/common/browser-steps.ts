import { When } from '@badeball/cypress-cucumber-preprocessor';

When(/^je rafraîchis la page$/, function () {
  // cy.reload() is not working as a cy.visit
  cy.url().then((url) => cy.visit(url, { failOnStatusCode: false }));
  // Wait for the page to load
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});
