import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import TopMenuComponent from '../../pages/top-menu-component';

const topMenuComponent = new TopMenuComponent();

Then("le nom de l'usager de l'espace partenaires est affiché", function () {
  const { given_name, usual_name } = this.user.claims;
  const fullName = `${given_name} ${usual_name}`;
  topMenuComponent.getUserLabel().should('contain', fullName);
});

Then("le lien de déconnexion de l'espace partenaires est affiché", function () {
  topMenuComponent.getLogoutLink().should('be.visible');
});

When('je me déconnecte du tableau de bord usager', function () {
  topMenuComponent.getLogoutLink().click();
});

When(
  "j'ouvre le menu de navigation mobile de l'espace partenaires",
  function () {
    topMenuComponent.getOpenMobileMenuButton().click();
  },
);
