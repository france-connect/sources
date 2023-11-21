import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderPage from '../pages/service-provider-page';

When('je me déconnecte du fournisseur de service', function () {
  const serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
  const { url: idpUrl } = this.identityProvider;
  const { fcaRootUrl } = this.env;
  const { url: spUrl } = this.serviceProvider;

  cy.intercept(`${idpUrl}/session/end*`).as('idp:sessionEnd');
  cy.intercept(`${fcaRootUrl}/api/v2/client/logout-callback*`).as(
    'idp:logoutCallback',
  );
  cy.intercept(`${fcaRootUrl}/api/v2/session/end/confirm*`).as(
    'fca:sessionEndConfirm',
  );
  cy.intercept(`${spUrl}/client/logout-callback*`).as('sp:logoutCallback');

  serviceProviderPage.getLogoutButton().click();
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

Then('la session AgentConnect est détruite', function () {
  cy.wait('@fca:sessionEndConfirm').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(303);
  });
});

Then('je suis déconnecté du fournisseur de service', function () {
  cy.wait('@sp:logoutCallback').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(302);
  });
});
