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
  'je suis redirigé vers la page erreur technique eidas-bridge',
  function () {
    technicalErrorPage.checkEidasErrorPageIsVisible();
  },
);

Then(
  "le code d'erreur FranceConnect est {string}",
  function (errorCode: string) {
    technicalErrorPage.checkErrorCode(errorCode);
  },
);

Then(
  "le sous-titre de la page d'erreur est {string}",
  function (errorTitle: string) {
    technicalErrorPage.checkErrorSubTitle(errorTitle);
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
  /^le bouton "(contacter le support|consulter la faq)" est affiché$/,
  function (text: string) {
    const buttonType = text.includes('support') ? 'support' : 'faq';
    technicalErrorPage.checkIsSupportButtonVisible(buttonType);
  },
);

Then(
  "le lien vers la faq contient le code d'erreur {string}",
  function (errorCode: string) {
    technicalErrorPage.checkSupportLinkHref(errorCode);
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
