import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { User } from '../../common/helpers';
import UdMenuComponent from '../pages/ud-menu-component';

const udMenuComponent = new UdMenuComponent();

Then("le nom de l'usager du user dashboard est affiché", function () {
  const { fullName } = this.user as User;
  udMenuComponent.userLabel.should('have.text', fullName);
});

Then('le lien de déconnexion du user dashboard est affiché', function () {
  udMenuComponent.logoutLink.should('be.visible');
});

When(
  'je clique sur le lien vers la page historique du dashboard usager',
  function () {
    udMenuComponent.historyLink.click();
  },
);

When(
  'je clique sur le lien vers la page gestion des accès du dashboard usager',
  function () {
    // Intercept used when waiting for the load of the /preferences
    cy.intercept({
      method: 'GET',
      url: '/api/user-preferences',
    }).as('UD:UserPreferences');

    udMenuComponent.preferencesLink.click();
  },
);

When('je me déconnecte du dashboard usager', function () {
  udMenuComponent.logoutLink.click();
});
