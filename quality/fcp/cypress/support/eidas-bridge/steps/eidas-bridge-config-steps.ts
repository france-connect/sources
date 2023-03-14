import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo } from '../../common/helpers';

When(
  'je navigue sur la page openid configuration de eidas-bridge',
  function () {
    const { allAppsUrl } = this.env;
    navigateTo({
      appId: 'eidas-bridge-openid-configuration',
      baseUrl: allAppsUrl,
    });
  },
);

Then(/^le scope "([^"]+)" (est|n'est pas) supporté$/, function (scope, text) {
  const includeNotInclude = text === 'est' ? 'include' : 'not.include';
  cy.document()
    .its('body')
    .invoke('text')
    .then((json) => JSON.parse(json))
    .its('scopes_supported')
    .should(includeNotInclude, scope);
});
