import { Given } from '@badeball/cypress-cucumber-preprocessor';

import {
  getIdentityProviderByAttributes,
  getIdentityProviderByDescription,
} from '../helpers';

Given(
  /^j'utilise (?:le|un) fournisseur d'identité "([^"]+)"$/,
  function (description: string) {
    this.identityProvider = getIdentityProviderByDescription(
      this.identityProviders,
      description,
    );
  },
);

Given(
  /^j'utilise un fournisseur d'identité avec niveau de sécurité "([^"]*)"(?:, chiffrement "([^"]*)")?(?: et signature "([^"]*)")?$/,
  function (acrValue: string, encryption?: string, signature?: string) {
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
