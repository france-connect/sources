import { Given } from '@badeball/cypress-cucumber-preprocessor';

import IdpMonCompteProPage from '../pages/idp-moncomptepro-page';

const idpMonCompteProPage = new IdpMonCompteProPage();

Given('je me connecte sur moncomptepro', function () {
  expect(this.user).to.exist;
  const { idpId } = this.identityProvider;
  const userCredentials = this.user.getCredentials(idpId);
  expect(userCredentials).to.exist;
  idpMonCompteProPage.loginWithSavedUsername(userCredentials);
});

Given('je sélectionne une organisation publique', function () {
  idpMonCompteProPage.selectPublicOrganization();
});

Given('je sélectionne une organisation privée', function () {
  idpMonCompteProPage.selectPrivateOrganization();
});
