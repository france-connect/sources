import { Then } from 'cypress-cucumber-preprocessor/steps';

import TechnicalErrorPage from '../pages/technical-error-page';

const {
  checkErrorCode,
  checkErrorMessage,
  checkIsVisible,
  checkSessionNumberVisible,
} = new TechnicalErrorPage();

Then('je suis redirigé vers la page erreur technique', function () {
  checkIsVisible();
});

Then("le code d'erreur est {string}", function (errorCode) {
  checkErrorCode(errorCode);
});

Then("le message d'erreur est {string}", function (errorCode) {
  checkErrorMessage(errorCode);
});

Then('le numéro de session AgentConnect est affiché', function () {
  checkSessionNumberVisible();
});
