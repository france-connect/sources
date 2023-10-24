import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When(/^je rafraîchis la page$/, function () {
  cy.reload();
  cy.waitForNetworkIdle('/api', 500);
});

Then('le haut de la page est affiché', function () {
  cy.window().then(($window) => {
    expect($window.scrollY).to.be.closeTo(0, 0);
  });
});
