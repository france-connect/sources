import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import {
  addInterceptHeaders,
  checkFCBasicAuthorization,
  isUsingFCBasicAuthorization,
  navigateTo,
} from '../../common/helpers';
import { ServiceProvider, UserClaims } from '../../common/types';
import { getClaims, getRnippClaims, getScopeByType } from '../helpers';
import ServiceProviderPage from '../pages/service-provider-page';

let serviceProviderPage: ServiceProviderPage;

When('je navigue sur la page fournisseur de service', function () {
  const { allAppsUrl } = this.env;
  const currentServiceProvider: ServiceProvider = this.serviceProvider;
  expect(currentServiceProvider).to.exist;
  serviceProviderPage = new ServiceProviderPage(currentServiceProvider);
  navigateTo({ appId: currentServiceProvider.name, baseUrl: allAppsUrl });
});

When('je clique sur le bouton FranceConnect', function () {
  if (serviceProviderPage.isLegacySPMock()) {
    // when on legacy service provider mock we call directly authorize
    const { fcRootUrl } = this.env;
    serviceProviderPage.callAuthorize(fcRootUrl, this.requestedScope);
    return;
  }

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
  serviceProviderPage.getFcButton().click();

  if (isUsingFCBasicAuthorization()) {
    checkFCBasicAuthorization();
  }
});

When(
  /^j'initie une connexion suspecte à (?:FranceConnect low|FranceConnect\+)$/,
  function () {
    // TODO to move to serviceProviderPage
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

    const headers = {
      'X-Suspicious': '1',
    };
    addInterceptHeaders(headers, 'FC:suspicious');

    serviceProviderPage.getFcButton().click();

    if (isUsingFCBasicAuthorization()) {
      checkFCBasicAuthorization();
    }
  },
);

Then('je suis redirigé vers la page fournisseur de service', function () {
  serviceProviderPage.checkIsVisible();
});

Then('je suis connecté au fournisseur de service', function () {
  // Init serviceProviderPage because this step can be called without
  // being preceded by the navigation step
  serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
  serviceProviderPage.checkIsUserConnected();
});

Then(
  /le fournisseur de service a accès aux informations (?:du|des) scopes? "([^"]+)"/,
  function (type) {
    const allClaims: UserClaims = this.user.allClaims;
    if (this.serviceProvider.mocked === true) {
      const platform: string = Cypress.env('PLATFORM');
      const scope = getScopeByType(this.scopes, type);
      const expectedClaims = getClaims(scope);
      if (platform === 'fcp-high') {
        // Get automatically the equivalent RNIPP claims
        const rnippClaims = getRnippClaims(allClaims);
        const userClaims = {
          ...rnippClaims,
          ...allClaims,
        };
        serviceProviderPage.checkMockInformationAccess(
          expectedClaims,
          userClaims,
        );
        return;
      }
      if (platform === 'fcp-low') {
        // Force the given_name_array claim into expectedClaim
        if (expectedClaims.includes('given_name')) {
          expectedClaims.push('given_name_array');
        }
        serviceProviderPage.checkMockInformationAccess(
          expectedClaims,
          allClaims,
        );
        return;
      }
      serviceProviderPage.checkMockInformationAccess(expectedClaims, allClaims);
    }
  },
);

Then('le fournisseur de service a accès aux traces FranceConnect', function () {
  serviceProviderPage.checkTracks();
});

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
  'le token retourné au FS est signé avec la clé provenant du HSM',
  function () {
    serviceProviderPage.getMockIdTokenText().then((idToken: string) => {
      const es256SigPubKey = Cypress.env('ES256_SIG_PUB_KEY');
      cy.task('isJwsValid', {
        jws: idToken,
        sigPubKey: es256SigPubKey,
      }).should('be.true');
    });
  },
);

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
