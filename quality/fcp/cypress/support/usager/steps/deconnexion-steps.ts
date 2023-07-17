import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import ServiceProviderPage from '../pages/service-provider-page';

When(
  "je me déconnecte du fournisseur de service et du fournisseur d'identité",
  function () {
    const serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
    const { url: idpUrl } = this.identityProvider;
    const { fcRootUrl } = this.env;
    const { url: spUrl } = this.serviceProvider;

    cy.intercept(`${idpUrl}/session/end*`).as('idp:sessionEnd');
    cy.intercept(`${fcRootUrl}/api/v2/client/logout-callback*`).as(
      'idp:logoutCallback',
    );
    cy.intercept(`${fcRootUrl}/api/v2/session/end/confirm*`).as(
      'fcp:sessionEndConfirm',
    );
    cy.intercept(`${spUrl}/client/logout-callback*`).as('sp:logoutCallback');

    serviceProviderPage.getLogoutButton().click();
  },
);

When(
  'je me déconnecte du fournisseur de service et de FranceConnect',
  function () {
    const serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
    const { url: idpUrl } = this.identityProvider;
    const { fcRootUrl } = this.env;
    const { url: spUrl } = this.serviceProvider;

    cy.intercept(`${idpUrl}/session/end*`).as('idp:sessionEnd');
    cy.intercept(`${fcRootUrl}/api/v2/session/end*`).as('fcp:sessionEnd');
    cy.intercept(`${fcRootUrl}/api/v2/session/end/confirm*`).as(
      'fcp:sessionEndConfirm',
    );
    cy.intercept(`${spUrl}/client/logout-callback*`).as('sp:logoutCallback');

    serviceProviderPage.getLogoutButton().click();
  },
);

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

  cy.wait('@idp:logoutCallback').then((intercept) => {
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
