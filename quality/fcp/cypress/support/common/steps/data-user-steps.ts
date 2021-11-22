import { Given } from 'cypress-cucumber-preprocessor/steps';

import { getEnabledUserByIdpId, getUserByCriteria } from '../../common/helpers';

Given("j'utilise un compte usager {string}", function (description) {
  getUserByCriteria(this.users, [description]);
});

Given(
  "j'utilise un compte usager actif pour ce fournisseur d'identité",
  function () {
    expect(this.identityProvider).to.exist;
    const { idpId } = this.identityProvider;
    getEnabledUserByIdpId(this.users, idpId);
  },
);
