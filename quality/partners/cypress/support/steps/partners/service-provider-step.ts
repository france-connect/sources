import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderPage from '../../pages/service-provider-page';

const serviceProviderPage = new ServiceProviderPage();

Then(
  /^le titre du fournisseur de service "([^"]+)" est affiché$/,
  function (title: string) {
    serviceProviderPage.getTitle(title).should('be.visible');
  },
);

Then(
  'je suis redirigé vers la page détails du fournisseur de service',
  function () {
    serviceProviderPage.getDatapassRequestIdLink().should('be.visible');
  },
);

Then(
  "je suis redirigé vers la page d'erreur du fournisseur de service",
  function () {
    serviceProviderPage.checkIsErrorPageVisible();
  },
);

Then(
  /^le nom de l'organisation "([^"]+)" est affiché$/,
  function (organizationName: string) {
    serviceProviderPage
      .getOrganizationName()
      .should('be.visible')
      .and('have.text', organizationName);
  },
);

Then(
  /^le numéro de la demande Datapass "([^"]+)" est affiché$/,
  function (requestId: string) {
    serviceProviderPage
      .getDatapassRequestIdLink()
      .should('be.visible')
      .and('have.text', requestId);
  },
);

Then(
  'les scopes Datapass suivants sont affichés:',
  function (dataTable: DataTable) {
    const expectedScopes = dataTable.raw().map((row) => row[0]);

    serviceProviderPage
      .getDatapassScopesList()
      .should('have.length', expectedScopes.length);

    expectedScopes.forEach((scope) => {
      serviceProviderPage.getDatapassScopesList().should('contain.text', scope);
    });
  },
);

When("je clique sur l'onglet scopes autorisés", function () {
  serviceProviderPage.getFcScopesTabButton().click();
});

Then(
  /^je suis redirigé vers l'onglet (données autorisées|scopes autorisés)$/,
  function (tabType: string) {
    const tabMapping: Record<string, string> = {
      'données autorisées': 'datapass-scopes-tab-button',
      'scopes autorisés': 'fc-scopes-tab-button',
    };
    serviceProviderPage.checkTabPanelVisible(tabMapping[tabType]);
  },
);

Then(
  'les scopes FranceConnect suivants sont affichés:',
  function (dataTable: DataTable) {
    const expectedScopes = dataTable.raw().map((row) => row[0]);

    serviceProviderPage
      .getFcScopesList()
      .should('have.length', expectedScopes.length);

    expectedScopes.forEach((scope) => {
      serviceProviderPage.getFcScopesList().should('contain.text', scope);
    });
  },
);
