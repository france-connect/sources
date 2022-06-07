import { Then, When } from 'cypress-cucumber-preprocessor/steps';

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
  