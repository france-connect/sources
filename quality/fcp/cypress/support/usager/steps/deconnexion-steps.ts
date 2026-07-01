import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderPage from '../pages/service-provider-page';

const getLogoutUrls = (fcRootUrl: string, idpUrl: string, spUrl: string) => ({
  'fcp:logoutCallback': `${fcRootUrl}/api/v2/client/logout-callback*`,
  'fcp:sessionEnd': `${fcRootUrl}/api/v2/session/end*`,
  'fcp:sessionEndConfirm': `${fcRootUrl}/api/v2/session/end/confirm*`,
  'idp:sessionEnd': `${idpUrl}/session/end*`,
  'sp:logoutCallback': `${spUrl}/client/logout-callback*`,
});

When(
  /^je me déconnecte du fournisseur de service et (?:du fournisseur d'identité|de FranceConnect)$/,
  function () {
    const serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
    const { url: idpUrl } = this.identityProvider;
    const { fcRootUrl } = this.env;
    const { url: spUrl } = this.serviceProvider;

    const logoutUrls = getLogoutUrls(fcRootUrl, idpUrl, spUrl);

    Object.entries(logoutUrls).forEach(([key, urlPattern]) =>
      cy.intercept(urlPattern).as(key),
    );

    serviceProviderPage.getLogoutButton().click();
  },
);

Then('je suis redirigé vers la page confirmation de déconnexion', function () {
  const { fcRootUrl } = this.env;
  cy.url().should(
    'contain',
    `${fcRootUrl}/api/v2/session/end/success?client_id=`,
  );
  cy.contains(
    'p',
    'Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.',
  );
});

Then('je suis déconnecté du fournisseur de service', function () {
  cy.wait('@sp:logoutCallback').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(302);
  });
});

Then('je suis déconnecté de FranceConnect', function () {
  cy.wait('@fcp:sessionEnd').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(200);
  });
});

Then("je suis déconnecté du fournisseur d'identité", function () {
  cy.wait('@idp:sessionEnd').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(200);
  });

  cy.wait('@fcp:logoutCallback').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(200);
  });
});

Then('la session FranceConnect est détruite', function () {
  cy.wait('@fcp:sessionEndConfirm').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(303);
  });
});
