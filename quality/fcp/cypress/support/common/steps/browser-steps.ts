import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When(/^je rafraîchis la page$/, function () {
  // cy.reload() is not working as a cy.visit
  cy.url().then((url) => cy.visit(url, { failOnStatusCode: false }));
  // Wait for the page to load
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});

When("j'attends le chargement de la page {int}ms", (ms: number) => cy.wait(ms));

When('je reviens en arrière', () => cy.go('back'));

Then('le haut de la page est affiché', function () {
  cy.window().then(($window) => {
    expect($window.scrollY).to.be.closeTo(0, 0);
  });
});

Then('la page est en {string}', function (lang: string) {
  const langMap = {
    anglais: 'en',
    français: 'fr',
  };
  cy.get('html').should('have.attr', 'lang', langMap[lang]);
});
