import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../helpers';
import TopMenuComponent from '../../pages/top-menu-component';

const topMenuComponent = new TopMenuComponent();

Given("je navigue sur la page d'accueil de l'espace partenaires", function () {
  const { allAppsUrl } = this.env;
  navigateTo({ appId: 'partners', baseUrl: allAppsUrl });
});

Given(
  "je navigue sur la page fournisseurs de service de l'espace partenaires",
  function () {
    topMenuComponent.getNavigationLink('Mes fournisseurs de service').click();
  },
);

Given(
  "je navigue sur la page liste des instances de l'espace partenaires",
  function () {
    topMenuComponent.getNavigationLink('Mes accès au bac à sable').click();
  },
);

Given(
  'je navigue sur la page fournisseurs de service introuvable',
  function () {
    const { partnersRootUrl } = this.env;
    cy.visit(
      `${partnersRootUrl}/fournisseurs-de-service/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
    );
  },
);

Then(
  /^je suis (connecté|déconnecté) (?:à|de) l'espace partenaires$/,
  function (text: string) {
    const { partnersRootUrl } = this.env;
    const isConnected = text === 'connecté';
    topMenuComponent.checkIsLogoutLinkVisible(isConnected);
    topMenuComponent.checkIsConnected(partnersRootUrl, isConnected);
  },
);

Then(/^je suis (redirigé vers|sur) la page plan du site$/, function () {
  cy.url().should('include', '/plan-du-site');
});

Then(/^je suis (redirigé vers|sur) la page mentions légales$/, function () {
  cy.url().should('include', '/mentions-legales');
});

Then(/^je suis (redirigé vers|sur) la page accessibilité$/, function () {
  cy.url().should('include', '/accessibilite');
});
