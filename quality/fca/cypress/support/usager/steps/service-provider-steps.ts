import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  checkFCBasicAuthorization,
  isUsingFCBasicAuthorization,
  navigateTo,
} from '../../common/helpers';
import { ServiceProvider } from '../../common/types';
import { getClaims } from '../helpers/scope-helper';
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
  const currentServiceProvider: ServiceProvider = this.serviceProvider;
  expect(currentServiceProvider).to.exist;
  serviceProviderPage = new ServiceProviderPage(currentServiceProvider);
  navigateTo({ appId: currentServiceProvider.name, baseUrl: allAppsUrl });
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
      const scope = this.scopes.find((scope) => scope.type === type);
      serviceProviderPage.checkMandatoryData();

      const expectedClaims: string[] = getClaims(scope);

      // Dynamic claims
      const claims = this.user.claims;
      if (expectedClaims.includes('idpId')) {
        claims.idpId = this.identityProvider.idpId;
      }

      if (expectedClaims.includes('idpAcr')) {
        claims.idpAcr = this.identityProvider.idpAcr;
      }

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

Given(
  "je rentre l'id du fournisseur d'identité dans le champ idp_hint",
  function () {
    const { idpId } = this.identityProvider;
    serviceProviderPage.setIdpHint(idpId);
  },
);
