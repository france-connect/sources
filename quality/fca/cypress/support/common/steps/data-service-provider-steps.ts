import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { getServiceProviderByDescription } from '../helpers';

Given(
  /^j'utilise (?:un|le) fournisseur de service "([^"]+)"$/,
  function (description: string) {
    this.serviceProvider = getServiceProviderByDescription(
      this.serviceProviders,
      description,
    );
    cy.log(`j'utilise le fournisseur de service ${this.serviceProvider.name}`);
  },
);

Given(
  /^le fournisseur de service requiert l'accès aux informations (?:du|des) scopes? "([^"]+)"$/,
  function (type: string) {
    this.requestedScope = this.scopes.find((scope) => scope.type === type);
  },
);

Given(
  /^le fournisseur de service (requiert|ne requiert pas) le claim "([^"]+)"$/,
  function (text: string, currentClaim: string) {
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
  /^le fournisseur de service a configuré sa requête authorize avec (?:un scope|des scopes) "([^"]+)"$/,
  function (type: string) {
    this.requestedScope = this.scopes.find((scope) => scope.type === type);
  },
);

Given(
  'le fournisseur de service requiert un niveau de sécurité {string}',
  function (acrValue: string) {
    this.serviceProvider.acrValue = acrValue;
  },
);

Given(
  'le fournisseur de service se connecte à AgentConnect via la méthode {string}',
  function (authorizeHttpMethod: 'post' | 'get') {
    this.serviceProvider.authorizeHttpMethod = authorizeHttpMethod;
  },
);
