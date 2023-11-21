import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When(/^je rafraîchis la page$/, function () {
  cy.reload();
  // Wait for the page to load
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});

Then('le haut de la page est affiché', function () {
  cy.window().then(($window) => {
    expect($window.scrollY).to.be.closeTo(0, 0);
  });
});
