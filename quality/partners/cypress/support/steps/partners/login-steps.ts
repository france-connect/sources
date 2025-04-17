import { Then } from '@badeball/cypress-cucumber-preprocessor';

import LoginPage from '../../pages/login-page';

const loginPage = new LoginPage();

Then(
  /^je suis (redirigé vers|sur) la page login de l'espace partenaires$/,
  function () {
    loginPage.checkIsVisible();
  },
);

Then(
  /^le message d'alerte "session expirée" (est|n'est pas) affiché$/,
  function (text) {
    const isDisplayed = text === 'est';
    loginPage.checkIsExpiredSessionAlertDisplayed(isDisplayed);
  },
);

Then('le bouton AgentConnect est visible', function () {
  loginPage.getLoginButton().should('be.visible');
});
