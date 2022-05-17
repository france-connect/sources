import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

import WelcomePage from '../pages/welcome-page';
import { Environment } from '../types';

const welcomePage = new WelcomePage();

Given("je navigue sur la page d'accueil du site partenaires", function () {
  const { partnersUrl } = this.env as Environment;
  cy.visit(partnersUrl);
});

Then('la page me souhaite la bienvenue sur le site partenaires', function () {
  const { welcomeMessage } = this.env as Environment;
  welcomePage.checkHelloWorld(welcomeMessage);
});
