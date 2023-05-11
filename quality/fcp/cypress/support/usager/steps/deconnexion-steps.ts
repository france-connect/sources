import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import ServiceProviderPage from '../pages/service-provider-page';

When('je me déconnecte du fournisseur de service', function () {
  const serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
  const { url: idpUrl } = this.identityProvider;
  const { fcpRootUrl } = this.env;
  const { url: spUrl } = this.serviceProvider;

  cy.intercept(`${idpUrl}/session/end*`).as('idp:sessionEnd');
  cy.intercept(`${fcpRootUrl}/api/v2/client/logout-callback*`).as(
    'idp:logoutCallback',
  );
  cy.intercept(`${fcpRootUrl}/api/v2/session/end/confirm*`).as(
    'fca:sessionEndConfirm',
  );
  cy.intercept(`${spUrl}/logout-callback*`).as('sp:logoutCallback');

  serviceProviderPage.getLogoutButton().click();
});

Then('je suis déconnecté du fournisseur de service', function () {
  cy.wait('@sp:logoutCallback').then((intercept) => {
    cy.log(intercept.request.url);
    expect(intercept.response?.statusCode).to.equal(302);
  });
});
