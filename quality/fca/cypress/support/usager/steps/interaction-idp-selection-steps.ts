import { Then } from '@badeball/cypress-cucumber-preprocessor';

import InteractionIdpSelectionPage from '../pages/interaction-idp-selection-page';

const interactionIdpSelectionPage = new InteractionIdpSelectionPage();

Then(
  /^le fournisseur d'identité "([^"]+)" (est|n'est pas) affiché$/,
  function (idpName: string, text: string) {
    const isVisible = text === 'est';
    interactionIdpSelectionPage
      .getSelectableIdps()
      .invoke('text')
      .should(isVisible ? 'contains' : 'not.contains', idpName);
  },
);

Then("je choisis le fournisseur d'identité {string}", function (text: string) {
  cy.contains('label', text).click();
  cy.contains('button', 'Continue').click();
});

Then(
  "je suis redirigé vers la page permettant la selection d'un fournisseur d'identité",
  function () {
    cy.contains('Choisir votre accès');
  },
);
