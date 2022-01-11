import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import {
  checkFCBasicAuthorization,
  isUsingFCBasicAuthorization,
  navigateTo,
} from '../../common/helpers';
import { ServiceProvider } from '../../common/types';
import { getClaims } from '../helpers/scope-helper';
import ServiceProviderPage from '../pages/service-provider-page';

let serviceProviderPage: ServiceProviderPage;

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
  serviceProviderPage.fcaButton.click();

  if (isUsingFCBasicAuthorization()) {
    checkFCBasicAuthorization();
  }
});

Then('je suis redirigé vers la page fournisseur de service', function () {
  serviceProviderPage.checkIsVisible();
});

Then('je suis connecté', function () {
  serviceProviderPage.checkIsUserConnected();
});

Then(
  /le fournisseur de service a accès aux informations (?:du|des) scopes? "([^"]+)"/,
  function (type) {
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
  function (acrValue) {
    serviceProviderPage.checkMockAcrValue(acrValue);
  },
);

Then("la cinématique a renvoyé l'amr {string}", function (amrValue) {
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
  function (errorCode) {
    serviceProviderPage.checkMockErrorCode(errorCode);
  },
);

Then(
  "la description de l'erreur fournisseur de service est {string}",
  function (errorDescription) {
    serviceProviderPage.checkMockErrorDescription(errorDescription);
  },
);
