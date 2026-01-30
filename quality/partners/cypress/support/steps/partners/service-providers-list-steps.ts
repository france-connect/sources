import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProvidersListPage from '../../pages/service-providers-list-page';

const serviceProvidersListPage = new ServiceProvidersListPage();

When(
  /^je clique sur le fournisseur de service "([^"]+)"$/,
  function (title: string) {
    serviceProvidersListPage.getServiceProviderCardByTitle(title).click();
  },
);

Then('je suis redirigé vers la liste des fournisseurs de service', function () {
  cy.url().should('include', '/fournisseurs-de-service');
});

Then('la page fournisseurs de service est affichée', function () {
  serviceProvidersListPage.checkIsVisible();
});

Then("aucun fournisseur de service n'est affiché", function () {
  serviceProvidersListPage.getServiceProvidersCardList().should('not.exist');
});

Then(
  /^(\d+) fournisseurs? de service sont affichés?$/,
  function (count: number) {
    serviceProvidersListPage
      .getAllServiceProvidersCards()
      .should('have.length', count);
  },
);
