import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { User } from '../../common/helpers';
import { UserCredentials } from '../../common/types';
import IdpMonCompteProPage from '../pages/idp-moncomptepro-page';

const idpMonCompteProPage = new IdpMonCompteProPage();

Given('je me connecte sur moncomptepro', function () {
  expect(this.user).to.exist;
  const currentUser: User = this.user;
  const { idpId } = this.identityProvider;
  const userCredentials: UserCredentials = currentUser.getCredentials(idpId);
  expect(userCredentials).to.exist;
  idpMonCompteProPage.loginWithSavedUsername(userCredentials);
});

Given('je sélectionne une organisation publique', function () {
  idpMonCompteProPage.selectPublicOrganization();
});

Given('je sélectionne une organisation privée', function () {
  idpMonCompteProPage.selectPrivateOrganization();
});
