import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

import TopMenuComponent from '../../pages/top-menu-component';

const topMenuComponent = new TopMenuComponent();

Given("je navigue sur la page d'accueil de l'espace partenaires", function () {
  topMenuComponent.visitHomePage();
});

Given(
  "je navigue sur la page fournisseurs de service de l'espace partenaires",
  function () {
    topMenuComponent.visitServiceProvidersPage();
  },
);

Then(
  /^je suis (connecté|déconnecté) (?:à|de) l'espace partenaires$/,
  function (text: string) {
    const isConnected = text === 'connecté';
    topMenuComponent.checkIsLogoutLinkVisible(isConnected);
    topMenuComponent.checkIsConnected(isConnected);
  },
);

Then(/^je suis (redirigé vers|sur) la page plan du site$/, function () {
  cy.url().should('include', '/plan-du-site');
});

Then(/^je suis (redirigé vers|sur) la page mentions légales$/, function () {
  cy.url().should('include', '/mentions-legales');
});

Then(
  /^je suis (redirigé vers|sur) la page fournisseurs de service$/,
  function () {
    cy.url().should('include', '/fournisseurs-de-service');
  },
);
