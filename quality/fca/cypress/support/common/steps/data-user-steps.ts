import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { getEnabledUserByIdpId, getUserByCriteria } from '../../common/helpers';

Given("j'utilise un compte usager {string}", function (description: string) {
  this.user = getUserByCriteria(this.users, [description]);
});

Given(
  "j'utilise un compte usager actif pour ce fournisseur d'identité",
  function () {
    expect(this.identityProvider).to.exist;
    const { idpId } = this.identityProvider;
    this.user = getEnabledUserByIdpId(this.users, idpId);
  },
);
