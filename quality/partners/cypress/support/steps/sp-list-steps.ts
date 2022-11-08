import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { getServiceProviderRolesByUserId } from '../helpers/service-provider-helper';
import SPListPage from '../pages/sp-list-page';

const spListPage = new SPListPage();

Then(
  'je suis redirigé vers la page liste des fournisseurs de service',
  function () {
    spListPage.checkIsVisible();
  },
);

Then(/^(\d+) fournisseurs? de service (est|sont) affichés?/, function (count) {
  spListPage.getAllServiceProviders().should('have.length', count);
});

Then("aucun fournisseur de service n'est affiché", function () {
  spListPage.getAllServiceProviders().should('not.exist');
});

Then(
  'le titre de la page liste des fournisseurs de service est {string}',
  function (title) {
    spListPage.getPageTitle().should('have.text', title);
  },
);

Then(
  /^le message d'erreur "vous n'avez aucun fournisseur de service" est affiché$/,
  function () {
    spListPage
      .getNoSpAlert()
      .should('be.visible')
      .invoke('text')
      .should('contain', 'Vous n’avez pas de fournisseur de service');
  },
);

Then('le nom du 1er fournisseur de service est affiché', function () {
  spListPage
    .getServiceProvider(0)
    .getSpName()
    .should('be.visible')
    .invoke('text')
    .should('have.length.above', 3);
});

Then("l'organisation du 1er fournisseur de service est affichée", function () {
  spListPage
    .getServiceProvider(0)
    .getOrganisationName()
    .should('be.visible')
    .invoke('text')
    .should('have.length.above', 3);
});

Then('la plateforme du 1er fournisseur de service est affichée', function () {
  spListPage
    .getServiceProvider(0)
    .getPlatformName()
    .should('be.visible')
    .invoke('text')
    .should('have.length.above', 3);
});

Then(
  'le numéro datapass du 1er fournisseur de service est affiché',
  function () {
    spListPage
      .getServiceProvider(0)
      .getDatapassId()
      .should('be.visible')
      .invoke('text')
      .should('match', /^Datapass N°⚠️\d+⚠️$/);
  },
);

Then(
  'le date de création du 1er fournisseur de service est affichée',
  function () {
    spListPage
      .getServiceProvider(0)
      .getCreationDate()
      .should('be.visible')
      .invoke('text')
      .should('match', /^Créé le : \d{2}\/\d{2}\/\d{4}$/);
  },
);

Then("l'état du 1er fournisseur de service est affiché", function () {
  spListPage.getServiceProvider(0).getSpBadge().should('be.visible');
});

Then(
  /^les informations (?:du|des) fournisseurs? de service de l'utilisateur sont affichées$/,
  function () {
    const { userId } = this.user;
    const spRoles = getServiceProviderRolesByUserId(
      this.roles,
      this.serviceProviders,
      userId,
    );
    expect(spRoles).to.have.length.above(0);
    spRoles.forEach((spRole, index) => {
      spListPage.getServiceProvider(index).checkDetails(spRole.serviceProvider);
    });
  },
);

When('je clique sur le 1er fournisseur de service', function () {
  // Set current service provider
  spListPage
    .getServiceProvider(0)
    .getSpName()
    .invoke('text')
    .then((spName) => {
      this.serviceProvider = this.serviceProviders.find(
        ({ name }) => name === spName,
      );
    });
  spListPage.getServiceProvider(0).getSpName().click();
});
