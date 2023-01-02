import { Then } from 'cypress-cucumber-preprocessor/steps';

import TechnicalErrorPage from '../pages/technical-error-page';

const { checkErrorCode, checkErrorMessage, checkIsVisible } =
  new TechnicalErrorPage();

Then(/^je suis redirigé vers la page erreur technique$/, function () {
  checkIsVisible();
});

Then(/^le code d'erreur est "([^"]*)"$/, function (errorCode) {
  checkErrorCode(errorCode);
});

Then(/^le message d'erreur FranceConnect est "([^"]*)"$/, function (message) {
  checkErrorMessage(message);
});
