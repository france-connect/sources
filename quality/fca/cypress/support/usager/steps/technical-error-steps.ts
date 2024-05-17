import { Then } from '@badeball/cypress-cucumber-preprocessor';

import TechnicalErrorPage from '../pages/technical-error-page';

const {
  checkErrorCode,
  checkErrorMessage,
  checkErrorTitle,
  checkIsVisible,
  checkSessionNumberVisible,
} = new TechnicalErrorPage();

Then('je suis redirigé vers la page erreur technique', function () {
  checkIsVisible();
});

Then(
  "le titre de la page d'erreur est {string}",
  function (errorTitle: string) {
    checkErrorTitle(errorTitle);
  },
);

Then("le code d'erreur est {string}", function (errorCode: string) {
  checkErrorCode(errorCode);
});

Then("le message d'erreur est {string}", function (errorCode: string) {
  checkErrorMessage(errorCode);
});

Then('le numéro de session AgentConnect est affiché', function () {
  checkSessionNumberVisible();
});
