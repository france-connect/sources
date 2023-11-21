import { Given } from '@badeball/cypress-cucumber-preprocessor';

import {
  getIdentityProviderByAttributes,
  getIdentityProviderByDescription,
} from '../helpers';

Given(
  /^j'utilise (?:un|le) fournisseur d'identité "([^"]+)"$/,
  function (description: string) {
    this.identityProvider = getIdentityProviderByDescription(
      this.identityProviders,
      description,
    );
    cy.log(
      `j'utilise le fournisseur d'identité ${this.identityProvider.idpId}`,
    );
  },
);

Given(
  "j'utilise un fournisseur d'identité avec niveau de sécurité {string} et signature {string}",
  function (acrValue: string, signature: string) {
    this.identityProvider = getIdentityProviderByAttributes(
      this.identityProviders,
      {
        acrValue,
        signature,
        usable: true,
      },
    );
    cy.log(
      `j'utilise le fournisseur d'identité ${this.identityProvider.idpId}`,
    );
  },
);
