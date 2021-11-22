import { Given } from 'cypress-cucumber-preprocessor/steps';

import {
  getIdentityProviderByAttributes,
  getIdentityProviderByDescription,
} from '../helpers';

Given(
  /^j'utilise (?:un|le) fournisseur d'identité "([^"]+)"$/,
  function (description) {
    const { idpId } = getIdentityProviderByDescription(
      this.identityProviders,
      description,
    );
    cy.log(`j'utilise le fournisseur d'identité ${idpId}`);
  },
);

Given(
  "j'utilise un fournisseur d'identité avec niveau de sécurité {string} et signature {string}",
  function (acrValue, signature) {
    const { idpId } = getIdentityProviderByAttributes(this.identityProviders, {
      acrValue,
      signature,
      usable: true,
    });
    cy.log(`j'utilise le fournisseur d'identité ${idpId}`);
  },
);
