import { Then } from 'cypress-cucumber-preprocessor/steps';

import { TechnicalErrorPage } from '../pages/legacy-pages';

const { checkErrorCode, checkErrorMessage, checkIsVisible } =
  new TechnicalErrorPage();

Then(
  'je suis redirigé vers la page erreur technique FranceConnect Legacy',
  function () {
    checkIsVisible();
  },
);

Then(
  "le code d'erreur FranceConnect Legacy est {string}",
  function (errorCode) {
    checkErrorCode(errorCode);
  },
);

Then(
  "le message d'erreur FranceConnect Legacy est {string}",
  function (message) {
    checkErrorMessage(message);
  },
);
