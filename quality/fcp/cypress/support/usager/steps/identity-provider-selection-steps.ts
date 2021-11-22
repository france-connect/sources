import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import IdentityProviderSelectionPage from '../pages/identity-provider-selection-page';

const identityProviderSelectionPage = new IdentityProviderSelectionPage();

Then(
  "je suis redirigé vers la page sélection du fournisseur d'identité",
  function () {
    identityProviderSelectionPage.checkIsVisible();
  },
);

Then(
  /^le fournisseur d'identité (est|n'est pas) affiché dans la mire$/,
  function (text) {
    const isVisible = text === 'est';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider.idpId)
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^le fournisseur d'identité est (actif|désactivé) dans la mire$/,
  function (state) {
    const isEnabled = state === 'actif';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider.idpId)
      .should(isEnabled ? 'be.enabled' : 'be.disabled');
  },
);

When("je clique sur le fournisseur d'identité", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage
    .getIdpButton(this.identityProvider.idpId)
    .click({ force: true });
});
