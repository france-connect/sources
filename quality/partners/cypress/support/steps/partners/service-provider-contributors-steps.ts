import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderContributorsSection from '../../pages/service-provider-contributors-section';
import ServiceProviderSandboxesSection from '../../pages/service-provider-sandboxes-section';

const serviceProviderSandboxesSection = new ServiceProviderSandboxesSection();
const serviceProviderContributorsSection =
  new ServiceProviderContributorsSection();

When('je clique sur le bouton "ajouter un contributeur"', function () {
  serviceProviderContributorsSection.getAddContributorButton().click();
});

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
