import { Given } from 'cypress-cucumber-preprocessor/steps';

import {
  getIdentityProviderByAttributes,
  getIdentityProviderByDescription,
} from '../helpers';

Given("j'utilise le fournisseur d'identité {string}", function (description) {
  this.identityProvider = getIdentityProviderByDescription(
    this.identityProviders,
    description,
  );
});

Given(
  /^j'utilise (?:le|un) fournisseur d'identité "([^"]+)"$/,
  function (description) {
    this.identityProvider = getIdentityProviderByDescription(
      this.identityProviders,
      description,
    );
  },
);

Given(
  "j'utilise un fournisseur d'identité avec niveau de sécurité {string}",
  function (acrValue) {
    this.identityProvider = getIdentityProviderByAttributes(
      this.identityProviders,
      { acrValue },
    );
  },
);

Given(
  /^j'utilise un fournisseur d'identité avec niveau de sécurité "([^"]*)"(?:, chiffrement "([^"]*)")?(?: et signature "([^"]*)")?$/,
  function (acrValue, encryption, signature) {
    this.identityProvider = getIdentityProviderByAttributes(
      this.identityProviders,
      {
        acrValue,
        encryption,
        signature,
      },
    );
  },
);
