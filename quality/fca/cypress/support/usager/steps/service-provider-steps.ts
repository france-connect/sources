import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  checkFCBasicAuthorization,
  isUsingFCBasicAuthorization,
  navigateTo,
} from '../../common/helpers';
import { getClaims, getScopeByType } from '../helpers';
import ServiceProviderPage from '../pages/service-provider-page';

let serviceProviderPage: ServiceProviderPage;

Given('je mémorise le sub envoyé au fournisseur de service', function () {
  serviceProviderPage.getMockSubText().as('spSub');
});

When("je redemande les informations de l'usager", function () {
  serviceProviderPage.getUserInfoButton().click();
});

When('je navigue sur la page fournisseur de service', function () {
  const { allAppsUrl } = this.env;
  expect(this.serviceProvider).to.exist;
  serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
  navigateTo({ appId: this.serviceProvider.name, baseUrl: allAppsUrl });
});

When('je clique sur le bouton AgentConnect', function () {
  // Setup the requested scope and eidas on mocked environment
  if (this.serviceProvider.mocked === true) {
    serviceProviderPage.setMockAuthorizeHttpMethod(
      this.serviceProvider.authorizeHttpMethod,
    );
    serviceProviderPage.setMockRequestedAmr(
      this.serviceProvider.claims.includes('amr'),
    );
    serviceProviderPage.setMockRequestedScope(this.requestedScope);
    serviceProviderPage.setMockRequestedAcr(this.serviceProvider.acrValue);
  }
  serviceProviderPage.getFcaButton().click();

  if (isUsingFCBasicAuthorization()) {
    checkFCBasicAuthorization();
  }
});

Then('je suis redirigé vers la page fournisseur de service', function () {
  serviceProviderPage.checkIsVisible();
});

Then('je suis connecté au fournisseur de service', function () {
  serviceProviderPage.checkIsUserConnected();
});

Then(
  /le fournisseur de service a accès aux informations (?:du|des) scopes? "([^"]+)"/,
  function (type: string) {
    if (this.serviceProvider.mocked === true) {
      serviceProviderPage.checkMandatoryData();
      const scope = getScopeByType(this.scopes, type);
      const expectedClaims = getClaims(scope);

      const { claims } = this.user;
      // Add idp claims' values
      const idpClaimsMap = [
        { claim: 'idp_acr', valueKey: 'acrValue' },
        { claim: 'idp_id', valueKey: 'idpId' },
      ];
      idpClaimsMap.forEach(({ claim, valueKey }) => {
        claims[claim] = this.identityProvider[valueKey];
      });

      serviceProviderPage.checkExpectedUserClaims(expectedClaims, claims);
      serviceProviderPage.checkNoExtraClaims(expectedClaims);
    }
  },
);

Then(
  'la cinématique a utilisé le niveau de sécurité {string}',
  function (acrValue: string) {
    serviceProviderPage.checkMockAcrValue(acrValue);
  },
);

Then("la cinématique a renvoyé l'amr {string}", function (amrValue: string) {
  serviceProviderPage.checkMockAmrValue(amrValue);
});

Then("la cinématique n'a pas renvoyé d'amr", function () {
  serviceProviderPage.checkMockAmrValue('N/A');
});

Then(
  'je suis redirigé vers la page erreur du fournisseur de service',
  function () {
    serviceProviderPage.checkMockErrorCallback();
  },
);

Then(
  "le titre de l'erreur fournisseur de service est {string}",
  function (errorCode: string) {
    serviceProviderPage.checkMockErrorCode(errorCode);
  },
);

Then(
  "la description de l'erreur fournisseur de service est {string}",
  function (errorDescription: string) {
    serviceProviderPage.checkMockErrorDescription(errorDescription);
  },
);

Then(
  /^le sub transmis au fournisseur de service est (identique|différent) [ad]u sub mémorisé$/,
  function (text: string) {
    const comparison = text === 'identique' ? 'be.equal' : 'not.be.equal';

    cy.get<string>('@spSub').then((previousSpSub) => {
      serviceProviderPage.getMockSubText().should(comparison, previousSpSub);
    });
  },
);

Then(
  'le sub transmis au fournisseur de service est le suivant {string}',
  function (sub: string) {
    serviceProviderPage.getMockSubText().should('be.equal', sub);
  },
);

Given(
  "je rentre l'id du fournisseur d'identité dans le champ idp_hint",
  function () {
    const { idpId } = this.identityProvider;
    serviceProviderPage.setIdpHint(idpId);
  },
);

Given('je rentre {string} dans le champ prompt', function (prompt: string) {
  if (prompt === 'disabled') {
    serviceProviderPage.disablePrompt();
    return;
  }
  serviceProviderPage.setPrompt(prompt);
});

When('je révoque le token AgentConnect', function () {
  serviceProviderPage.getRevokeTokenButton().click();
});

When(
  "le fournisseur de service demande l'accès aux données au fournisseur de données",
  function () {
    serviceProviderPage.getDataButton().click();
  },
);

Then(
  "le fournisseur de données vérifie l'access token fourni par le fournisseur de service",
  function () {
    serviceProviderPage.checkIsMockDataPageVisible();
    serviceProviderPage
      .getMockIntrospectionTokenText()
      .should('be.ok')
      .then((tokenText) => {
        const token = JSON.parse(tokenText);
        cy.wrap(token).as('tokenIntrospection');
      });
  },
);

Given(
  "je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service",
  function () {
    const { url } = this.serviceProvider;
    cy.intercept(`${url}/oidc-callback*`, (req) => {
      req.reply({
        body: '<h1>Intercepted request</h1>',
      });
    }).as('FS:OidcCallback');
  },
);

Given(
  'je mets le code renvoyé par AC au FS dans la propriété "code" du corps de la requête',
  function () {
    cy.wait('@FS:OidcCallback')
      .its('request.query.code')
      .should('exist')
      .then((value: string) => {
        this.apiRequest.body['code'] = value;
      });
  },
);

Then('le token AgentConnect est révoqué', function () {
  serviceProviderPage.getTokenRevokationConfirmation().should('be.visible');
});
