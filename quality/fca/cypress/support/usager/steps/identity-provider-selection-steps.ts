import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import IdentityProviderSelectionPage from '../pages/identity-provider-selection-page';

const identityProviderSelectionPage = new IdentityProviderSelectionPage();

Then(
  "je suis redirigé vers la page sélection du fournisseur d'identité",
  function () {
    identityProviderSelectionPage.checkIsVisible();
  },
);

When("je cherche le fournisseur d'identité par son ministère", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage.searchIdentityProvider(
    this.identityProvider.ministry,
  );
});

When("je cherche le fournisseur d'identité par son nom", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage.searchIdentityProvider(
    this.identityProvider.title,
  );
});

When(
  /^je cherche le fournisseur d'identité(?: par son nom| par son ministère)? avec "([^"]+)"$/,
  function (terms) {
    identityProviderSelectionPage.searchIdentityProvider(terms);
  },
);

Then('le ministère du FI est affiché dans la liste', function () {
  const { ministry } = this.identityProvider;
  identityProviderSelectionPage.checkIsMinistryVisible(ministry);
});

Then('plusieurs ministères sont affichés dans la liste', function () {
  identityProviderSelectionPage.getMinistries().should('have.length.above', 1);
});

Then('le nombre de ministère affiché est {int}', function (count) {
  identityProviderSelectionPage.getMinistries().should('have.length', count);
});

Then(
  "plusieurs fournisseurs d'identité sont affichés dans la liste",
  function () {
    identityProviderSelectionPage
      .getIdentityProviders()
      .should('have.length.above', 1);
  },
);

Then("aucun fournisseur d'identité n'est trouvé", function () {
  identityProviderSelectionPage.checkIsNoResultMessageIsVisible();
  identityProviderSelectionPage.getIdentityProviders().should('not.exist');
});

Then(
  /^le fournisseur d'identité (est|n'est pas) affiché dans la liste$/,
  function (text) {
    const isVisible = text === 'est';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider.idpId)
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^le fournisseur d'identité est (actif|désactivé) dans la liste$/,
  function (state) {
    const isEnabled = state === 'actif';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider.idpId)
      .should(isEnabled ? 'be.enabled' : 'be.disabled');
  },
);

When("je sélectionne le fournisseur d'identité", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage.searchIdentityProvider(
    this.identityProvider.ministry,
  );
  identityProviderSelectionPage
    .getIdpButton(this.identityProvider.idpId)
    .click();
});

When("je clique sur le fournisseur d'identité", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage
    .getIdpButton(this.identityProvider.idpId)
    .click({ force: true });
});
