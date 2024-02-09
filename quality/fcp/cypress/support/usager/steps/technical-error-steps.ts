import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import TechnicalErrorPage from '../pages/technical-error-page';

const technicalErrorPage = new TechnicalErrorPage();

Then(
  'je suis redirigé vers la page erreur technique FranceConnect',
  function () {
    technicalErrorPage.checkIsVisible();
  },
);

Then(
  "le code d'erreur FranceConnect est {string}",
  function (errorCode: string) {
    technicalErrorPage.checkErrorCode(errorCode);
  },
);

Then(
  "le message d'erreur FranceConnect est {string}",
  function (message: string) {
    // TODO: Delete this once FC Legacy page design is made consistent with the others
    const platform: string = Cypress.env('PLATFORM');
    if (platform === 'fcp-legacy') {
      technicalErrorPage.checkErrorTitle(message);
      return;
    }
    technicalErrorPage.checkErrorMessage(message);
  },
);

Then(
  /^le lien retour vers le FS (est|n'est pas) affiché dans la page erreur technique$/,
  function (text: string) {
    const isVisible = text === 'est';
    technicalErrorPage
      .getBackToSPLink()
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

When('je clique sur le lien retour vers le FS après une erreur', function () {
  technicalErrorPage.getBackToSPLink().click();
});
