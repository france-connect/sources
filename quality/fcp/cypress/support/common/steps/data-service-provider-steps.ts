import { Given } from 'cypress-cucumber-preprocessor/steps';

import { getScopeByType } from '../../usager/helpers';
import { getServiceProviderByDescription } from '../helpers';

Given(
  /^j'utilise (?:un|le) fournisseur de service "([^"]+)"$/,
  function (description) {
    getServiceProviderByDescription(this.serviceProviders, description);
  },
);

Given(
  /^le fournisseur de service requiert l'accès aux informations (?:du|des) scopes? "([^"]+)"$/,
  function (type) {
    const scope = getScopeByType(this.scopes, type);
    cy.wrap(scope).as('requestedScope');
  },
);

Given(
  /^le fournisseur de service a configuré sa requête authorize avec (?:un scope|des scopes) "([^"]+)"$/,
  function (type) {
    const scope = this.scopes.find((scope) => scope.type === type);
    cy.wrap(scope).as('requestedScope');
  },
);

Given(
  /^le fournisseur de service (requiert|ne requiert pas) le claim "([^"]+)"$/,
  function (text, currentClaim) {
    const isRequested = text === 'requiert';
    const { claims } = this.serviceProvider;

    const filteredClaims = claims.filter((claim) => claim != currentClaim);
    if (isRequested) {
      filteredClaims.push(currentClaim);
    }
    this.serviceProvider.claims = filteredClaims;
  },
);

Given(
  'le fournisseur de service requiert un niveau de sécurité {string}',
  function (acrValue) {
    this.serviceProvider.acrValue = acrValue;
  },
);

Given(
  'le fournisseur de service se connecte à FranceConnect via la méthode {string}',
  function (authorizeHttpMethod: 'post' | 'get') {
    this.serviceProvider.authorizeHttpMethod = authorizeHttpMethod;
  },
);
