import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

import TopMenuComponent from '../../pages/top-menu-component';

const topMenuComponent = new TopMenuComponent();

Given("je navigue sur la page d'accueil de l'espace partenaires", function () {
  topMenuComponent.visitHomePage();
});

Then(
  /^je suis (connecté|déconnecté) (?:à|de) l'espace partenaires$/,
  function (text: string) {
    const isConnected = text === 'connecté';
    topMenuComponent.checkIsLogoutLinkVisible(isConnected);
    topMenuComponent.checkIsConnected(isConnected);
  },
);
