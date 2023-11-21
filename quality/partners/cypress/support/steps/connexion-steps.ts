import { When } from '@badeball/cypress-cucumber-preprocessor';

import HomePage from '../pages/home-page';
import LoginPage from '../pages/login-page';

const homePage = new HomePage();
const loginPage = new LoginPage();

When('je me connecte au site partenaire', function () {
  const { credentials } = this.user;
  homePage.getLoginPageButton().click();
  loginPage.login(credentials);
});
