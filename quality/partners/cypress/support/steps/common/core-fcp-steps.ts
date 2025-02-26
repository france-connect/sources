import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  "je suis redirigé vers la page sélection du fournisseur d'identité",
  function () {
    cy.get('[data-testid="main-providers"]').should('be.visible');
  },
);
