import { Then } from '@badeball/cypress-cucumber-preprocessor';

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

Then("le code d'erreur est {string}", function (errorCode: string) {
  checkErrorCode(errorCode);
});

Then("le message d'erreur est {string}", function (errorCode: string) {
  checkErrorMessage(errorCode);
});

Then('le numéro de session AgentConnect est affiché', function () {
  checkSessionNumberVisible();
});
