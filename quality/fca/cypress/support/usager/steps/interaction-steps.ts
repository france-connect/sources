import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import InteractionPage from '../pages/interaction-page';

const interactionPage = new InteractionPage();

Then('je suis redirigé vers la page interaction', function () {
  interactionPage.checkIsVisible();
});

When("j'entre l'email {string}", function (email: string) {
  interactionPage.getEmail().clearThenType(email);
});

When('je clique sur le bouton de connexion', function () {
  interactionPage.getConnectionButton().click();
});

Then('le champ email correspond à {string}', function (email: string) {
  interactionPage.getEmail().invoke('val').should('be.equal', email);
});
