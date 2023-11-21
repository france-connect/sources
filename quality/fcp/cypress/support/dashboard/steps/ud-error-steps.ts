import { Then } from '@badeball/cypress-cucumber-preprocessor';

import UdErrorPage from '../pages/ud-error-page';

const udErrorPage = new UdErrorPage();

Then(
  /^je suis (redirigé vers|sur) la page d'erreur du dashboard usager$/,
  function () {
    udErrorPage.checkIsVisible();
  },
);

Then(/^l'erreur "accès interdit" est affichée$/, function () {
  udErrorPage.checkForbiddenError();
});
