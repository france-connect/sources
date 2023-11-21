import { Then } from '@badeball/cypress-cucumber-preprocessor';

import TechnicalErrorPage from '../pages/technical-error-page';

const { checkErrorCode, checkErrorMessage, checkErrorTitle, checkIsVisible } =
  new TechnicalErrorPage();

Then(
  'je suis redirigé vers la page erreur technique FranceConnect',
  function () {
    checkIsVisible();
  },
);

Then(
  "le code d'erreur FranceConnect est {string}",
  function (errorCode: string) {
    checkErrorCode(errorCode);
  },
);

Then(
  "le message d'erreur FranceConnect est {string}",
  function (message: string) {
    // TODO: Delete this once FC Legacy page design is made consistent with the others
    const platform: string = Cypress.env('PLATFORM');
    if (platform === 'fcp-legacy') {
      checkErrorTitle(message);
      return;
    }
    checkErrorMessage(message);
  },
);
