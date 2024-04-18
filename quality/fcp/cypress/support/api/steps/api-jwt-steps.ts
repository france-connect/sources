import { Then } from '@badeball/cypress-cucumber-preprocessor';

const jwtPartsMap = {
  'entête du JWE': 'jweHeader',
  'entête du JWS': 'jwsHeader',
  'payload du JWT': 'payload',
};

Then(/^le JWT n'est pas chiffré$/, function () {
  cy.get('@jwt').should('not.have.property', 'jweHeader');
});

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a (\d+) propriétés?$/,
  function (jwtPart: string, count: number) {
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .then((part) => Object.keys(part))
      .should('have.length', count);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a une propriété "([^"]+)"$/,
  function (jwtPart: string, property: string) {
    cy.get('@jwt').its(jwtPartsMap[jwtPart]).should('have.property', property);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) n'a pas de propriété "([^"]+)"$/,
  function (jwtPart: string, property: string) {
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .should('not.have.property', property);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a une propriété "([^"]+)" égale à "([^"]+)"$/,
  function (jwtPart: string, property: string, value: string) {
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .its(property)
      .should('equal', value);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a une propriété "([^"]+)" égale à (\d+)$/,
  function (jwtPart: string, property: string, value: number) {
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .its(property)
      .should('equal', value);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a une propriété "([^"]+)" égale à (true|false)$/,
  function (jwtPart: string, property: string, value: string) {
    const booleanValue = value === 'true';
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .its(property)
      .should('equal', booleanValue);
  },
);

Then(
  /^(?:le |l')(entête du JWE|entête du JWS|payload du JWT) a une propriété "([^"]+)" contenant "([^"]+)"$/,
  function (jwtPart: string, property: string, value: string) {
    cy.get('@jwt')
      .its(jwtPartsMap[jwtPart])
      .its(property)
      .should('include', value);
  },
);
