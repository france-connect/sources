import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import UdMenuComponent from '../pages/ud-menu-component';

const udMenuComponent = new UdMenuComponent();

Then("le nom de l'usager du tableau de bord usager est affiché", function () {
  const { fullName } = this.user;
  udMenuComponent.getUserLabel().should('have.text', fullName);
});

Then(
  'le lien de déconnexion du tableau de bord usager est affiché',
  function () {
    udMenuComponent.getLogoutLink().should('be.visible');
  },
);

When(
  'je clique sur le lien vers la page historique du tableau de bord usager',
  function () {
    udMenuComponent.getHistoryLink().click();
  },
);

When(
  'je clique sur le lien vers la page gestion des accès du tableau de bord usager',
  function () {
    udMenuComponent.getPreferencesLink().click();
  },
);

When('je me déconnecte du tableau de bord usager', function () {
  udMenuComponent.getLogoutLink().click();
  // TODO: Stop clearing the cookies once https://github.com/cypress-io/cypress/issues/25841 is fixed
  cy.clearAllCookies();
});

When(
  "j'ouvre le menu de navigation mobile du tableau de bord usager",
  function () {
    udMenuComponent.getOpenMobileMenuButton().click();
  },
);

When(
  'je clique sur le lien gérer mes accés dans le menu de navigation mobile',
  function () {
    // Intercept used when waiting for the load of the /preferences
    cy.intercept({
      method: 'GET',
      url: '/api/user-preferences',
    }).as('UD:UserPreferences');

    udMenuComponent.getPreferencesMobileLink().click();
  },
);
