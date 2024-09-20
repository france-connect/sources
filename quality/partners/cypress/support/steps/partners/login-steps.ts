import { Then } from '@badeball/cypress-cucumber-preprocessor';

import LoginPage from '../../pages/login-page';

const loginPage = new LoginPage();

Then(
  /^je suis (redirigé vers|sur) la page login de l'espace partenaires$/,
  function () {
    loginPage.checkIsVisible();
  },
);

Then('le bouton AgentConnect est visible', function () {
  loginPage.getLoginButton().should('be.visible');
});
