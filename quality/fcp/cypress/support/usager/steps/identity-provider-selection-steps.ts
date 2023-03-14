import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { addInterceptParams } from '../../common/helpers';
import { IdentityProvider } from '../../common/types';
import { getDefaultIdpScope } from '../helpers';
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
      .getIdpButton(this.identityProvider)
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^le fournisseur d'identité est (actif|désactivé) dans la mire$/,
  function (state) {
    const isEnabled = state === 'actif';
    identityProviderSelectionPage
      .getIdpButton(this.identityProvider)
      .should(isEnabled ? 'be.enabled' : 'be.disabled');
  },
);

Given(
  "je paramètre un intercepteur pour retirer le scope {string} au prochain appel au fournisseur d'identité",
  function (scopeToRemove) {
    const { idpId, url }: IdentityProvider = this.identityProvider;
    // Use requested scope for eidas idp and default scope for other idp
    const scopeContext =
      idpId === 'eidas-bridge'
        ? this.requestedScope
        : getDefaultIdpScope(this.scopes);
    const { scopes } = scopeContext;
    const modifiedScope = scopes
      .filter((scope) => scope !== scopeToRemove)
      .join(' ');
    addInterceptParams(
      `${url}/authorize*`,
      { scope: modifiedScope },
      'FI:IdpRemoveScope',
    );
  },
);

Given(
  "je paramètre un intercepteur pour ajouter le scope {string} au prochain appel au fournisseur d'identité",
  function (scopeToAdd) {
    const { idpId, url }: IdentityProvider = this.identityProvider;
    // Use requested scope for eidas idp and default scope for other idp
    const scopeContext =
      idpId === 'eidas-bridge'
        ? this.requestedScope
        : getDefaultIdpScope(this.scopes);
    const { scopes } = scopeContext;
    const modifiedScope = [...scopes, scopeToAdd].join(' ');
    addInterceptParams(
      `${url}/authorize*`,
      { scope: modifiedScope },
      'FI:IdpAddScope',
    );
  },
);

When("je clique sur le fournisseur d'identité", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage
    .getIdpButton(this.identityProvider)
    .click({ force: true });
});

When(
  'je clique sur le lien retour vers le fournisseur de service',
  function () {
    identityProviderSelectionPage.getBackToServiceProviderLink().click();
  },
);

When("je force l'utilisation du fournisseur d'identité", function () {
  expect(this.identityProvider).to.exist;
  identityProviderSelectionPage
    .getIdpButton(this.identityProvider.idpId)
    // Remove the disabled attribute
    .invoke('attr', 'disabled', false)
    .click({ force: true });
});
