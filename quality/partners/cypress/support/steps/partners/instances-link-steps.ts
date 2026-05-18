import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import InstancesLinkPage from '../../pages/instances-link-page';

const instancesLinkPage = new InstancesLinkPage();

Then('je suis redirigé vers la page de liaison des instances', function () {
  instancesLinkPage.getLinkInstancesTable().should('be.visible');
});

When(
  'je clique sur la case à cocher "sélectionner toutes les instances"',
  function () {
    instancesLinkPage.getSelectAllInstancesCheckbox().click({ force: true });
  },
);

Then('toutes les instances sont sélectionnées', function () {
  instancesLinkPage.getAllInstanceCheckboxes().should('be.checked');
});

Then("aucune instance n'est sélectionnée", function () {
  instancesLinkPage.getAllInstanceCheckboxes().should('not.be.checked');
});

When(
  "je clique sur la case à cocher de l'instance {string}",
  function (instanceName: string) {
    instancesLinkPage
      .getInstanceCheckboxByName(instanceName)
      .click({ force: true });
  },
);

Then(
  /^l'instance "([^"]+)" (est|n'est pas) sélectionnée$/,
  function (instanceName: string, text: string) {
    instancesLinkPage
      .getInstanceCheckboxByName(instanceName)
      .should(text === 'est' ? 'be.checked' : 'not.be.checked');
  },
);

Then(
  /^le bouton confirmer la liaison des instances est (actif|désactivé)$/,
  function (buttonState: string) {
    const expectedState =
      buttonState === 'désactivé' ? 'be.disabled' : 'be.enabled';
    instancesLinkPage.getLinkInstancesSubmitButton().should(expectedState);
  },
);

When('je confirme la liaison des instances', function () {
  instancesLinkPage.getLinkInstancesSubmitButton().click();
});

When("j'annule la liaison des instances", function () {
  instancesLinkPage.getLinkInstancesCancelButton().click();
});
