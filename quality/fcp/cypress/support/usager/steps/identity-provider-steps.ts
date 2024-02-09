import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { User } from '../../common/helpers';
import { UserCredentials } from '../../common/types';
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

Given(
  "le fournisseur d'identité garantit un niveau de sécurité {string}",
  function (idpAcr: string) {
    identityProviderPage.setMockAcrValue(idpAcr);
  },
);

When("je m'authentifie avec succès", function () {
  expect(this.user).to.exist;

  const currentUser: User = this.user;
  const { idpId } = this.identityProvider;
  const userCredentials: UserCredentials = currentUser.getCredentials(idpId);
  expect(userCredentials).to.exist;
  identityProviderPage.login(userCredentials);
});

When("je m'authentifie avec {string}", function (username: string) {
  identityProviderPage.login({ username });
});

When("je saisi manuellement l'identité de l'utilisateur", function () {
  expect(this.user).to.exist;

  const currentUser: User = this.user;

  identityProviderPage.useCustomIdentity(currentUser);
});
