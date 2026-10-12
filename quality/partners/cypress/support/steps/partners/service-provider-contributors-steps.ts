import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderContributorsSection from '../../pages/service-provider-contributors-section';
import ServiceProviderSandboxesSection from '../../pages/service-provider-sandboxes-section';

const serviceProviderSandboxesSection = new ServiceProviderSandboxesSection();
const serviceProviderContributorsSection =
  new ServiceProviderContributorsSection();

When('je clique sur le bouton "ajouter un contributeur"', function () {
  serviceProviderContributorsSection.getAddContributorButton().click();
});

Then('le bouton "ajouter un contributeur" n\'est pas affiché', function () {
  serviceProviderContributorsSection
    .getAddContributorButton()
    .should('not.exist');
});

Then(
  "aucun bouton de suppression n'est pas affiché dans le tableau des contributeurs",
  function () {
    serviceProviderContributorsSection.checkNoDeleteContributorButton();
  },
);

Then("l'alerte de succès d'ajout de contributeur est affichée", function () {
  serviceProviderSandboxesSection
    .getServiceProviderSandboxesSuccessAlert()
    .should('be.visible')
    .and('contain.text', 'Le contributeur a été ajouté avec succès.');
});

Then(
  /^le contributeur "([^"]+)" est présent dans le tableau des contributeurs$/,
  function (email: string) {
    serviceProviderContributorsSection.checkContributorInTable(email);
  },
);

Then(
  /^le contributeur "([^"]+)" n'est pas présent dans le tableau des contributeurs$/,
  function (email: string) {
    serviceProviderContributorsSection.checkContributorNotInTable(email);
  },
);

When(
  /^je clique sur le bouton de suppression du contributeur "([^"]+)"$/,
  function (email: string) {
    serviceProviderContributorsSection
      .getDeleteContributorButton(email)
      .click();
  },
);

When('je confirme la suppression du contributeur dans la modale', function () {
  serviceProviderContributorsSection
    .getDeleteContributorModalConfirmButton()
    .click();
});

Then(
  "l'alerte de succès de suppression de contributeur est affichée",
  function () {
    serviceProviderContributorsSection
      .getContributorAlert()
      .should('be.visible')
      .and('contain.text', 'L’accès du contributeur a bien été supprimé');
  },
);
