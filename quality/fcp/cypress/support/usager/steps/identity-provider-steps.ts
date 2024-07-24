import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import IdentityProviderPage from '../pages/identity-provider-page';

let identityProviderPage: IdentityProviderPage;

Then(
  /^je (suis|ne suis pas) redirigé vers la page login du fournisseur d'identité$/,
  function (text: string) {
    const expectVisible = text === 'suis';
    identityProviderPage = new IdentityProviderPage(this.identityProvider);
    if (expectVisible) {
      identityProviderPage.checkIsVisible();
    } else {
      identityProviderPage.checkIsNotVisible();
    }
  },
);

Then(
  /^Le fournisseur d'identité a été appelé avec le niveau de sécurité "([^"]+)"$/,
  function (idpAcr: string) {
    identityProviderPage.checkMockAcrValue(idpAcr);
  },
);

Given(
  "le fournisseur d'identité garantit un niveau de sécurité {string}",
  function (idpAcr: string) {
    identityProviderPage.setMockAcrValue(idpAcr);
  },
);

When("je m'authentifie avec succès", function () {
  expect(this.user).to.exist;

  const { idpId } = this.identityProvider;
  const userCredentials = this.user.getCredentials(idpId);
  expect(userCredentials).to.exist;
  identityProviderPage.login(userCredentials);
});

When("je m'authentifie avec {string}", function (username: string) {
  identityProviderPage.login({ username });
});

When("je saisi manuellement l'identité de l'utilisateur", function () {
  expect(this.user).to.exist;

  identityProviderPage.useCustomIdentity(this.user);
});

When('je clique sur le lien retour vers FC depuis un FI', function () {
  identityProviderPage.getBackToFCLink().click();
});
