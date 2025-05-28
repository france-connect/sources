import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(/^je suis (redirigé vers|sur) la page mentions légales$/, function () {
  cy.url().should('include', '/mentions-legales');
});
