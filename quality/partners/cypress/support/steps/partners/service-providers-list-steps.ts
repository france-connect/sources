import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProvidersListPage from '../../pages/service-providers-list-page';

const serviceProvidersListPage = new ServiceProvidersListPage();

Then(
  /^je suis (?:redirigé vers|sur) la page fournisseurs de service$/,
  function () {
    serviceProvidersListPage.checkIsVisible();
  },
);

When(
  /^je clique sur le fournisseur de service "([^"]+)"$/,
  function (title: string) {
    serviceProvidersListPage.getServiceProviderCardByTitle(title).click();
  },
);

When(
  /^je clique sur le fournisseur de service (créé|modifié) par datapass$/,
  function () {
    const { datapassRequestId } = this.serviceProvider;
    serviceProvidersListPage
      .getServiceProviderCardByRequestId(datapassRequestId)
      .click();
  },
);

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
