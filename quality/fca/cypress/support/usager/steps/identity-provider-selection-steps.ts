import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
  function (terms: string) {
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

Then('le nombre de ministère affiché est {int}', function (count: number) {
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

Then('moncomptepro est retourné', function () {
  identityProviderSelectionPage.checkIsNoResultMonCompteProMessageIsVisible();
  identityProviderSelectionPage.getIdentityProviders().should('not.exist');
});

Then("aucun fournisseur d'identité n'est trouvé", function () {
  identityProviderSelectionPage.checkIsNoResultMessageIsVisible();
  identityProviderSelectionPage.getIdentityProviders().should('not.exist');
});

Then(
  /^le fournisseur d'identité (est|n'est pas) affiché dans la liste$/,
  function (text: string) {
    const isVisible = text === 'est';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider.idpId)
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^le fournisseur d'identité est (actif|désactivé) dans la liste$/,
  function (state: string) {
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
