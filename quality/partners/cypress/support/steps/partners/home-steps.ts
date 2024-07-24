import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

import HomePage from '../../pages/home-page';

const homePage = new HomePage();

Given("je navigue sur la page d'accueil du site partenaires", function () {
  homePage.visit();
});

Then('le bouton AgentConnect est visible', function () {
  homePage.getLoginButton().should('be.visible');
});
