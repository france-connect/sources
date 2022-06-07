import { Then } from 'cypress-cucumber-preprocessor/steps';

import SPListPage from '../pages/sp-list-page';

const spListPage = new SPListPage();

Then(
  "je suis redirigé vers la page d'accueil utilisateur standard",
  function () {
    spListPage.checkIsVisible();
  },
);
