import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import HomePage from '../pages/home-page';
import NavigationPage from '../pages/navigation-page';

const homePage = new HomePage();
const navigationPage = new NavigationPage();

When("je navigue sur la page d'accueil du site partenaire", function () {
  navigationPage.visitHomePage(this.env);
  homePage.checkIsVisible();
});

Then('je suis connecté au site partenaire', function () {
  navigationPage.checkIsConnected();
});

Then("le nom complet de l'utilisateur est affiché dans le header", function () {
  navigationPage.checkIsUsernameDisplayed(this.user);
});

Then('le nom de la plateforme est affiché dans le header', function () {
  navigationPage.checkHeaderPlatfromName(this.env);
});
