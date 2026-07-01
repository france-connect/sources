import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderSandboxesSection from '../../pages/service-provider-sandboxes-section';

const serviceProviderSandboxesSection = new ServiceProviderSandboxesSection();

Then("l'alerte de succès de liaison des instances est affichée", function () {
  serviceProviderSandboxesSection
    .getServiceProviderSandboxesSuccessAlert()
    .should('be.visible')
    .and('contain.text', 'Instance reliée avec succès !');
});

Then(
  "l'alerte de succès de création d'accès au bac à sable est affichée",
  function () {
    serviceProviderSandboxesSection
      .getServiceProviderSandboxesSuccessAlert()
      .should('be.visible')
      .and('contain.text', 'accès au bac à sable');
  },
);

Then(
  /^le bouton "relier les instances" (est|n'est pas) affiché$/,
  function (text) {
    const isDisplayed = text === 'est';
    serviceProviderSandboxesSection
      .getLinkInstancesButton()
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

When('je clique sur le bouton "relier les instances"', function () {
  serviceProviderSandboxesSection.getLinkInstancesButton().click();
});

Then(
  /^le bouton "créer une instance" (est|n'est pas) affiché$/,
  function (text: string) {
    const isDisplayed = text === 'est';
    serviceProviderSandboxesSection
      .getCreateLinkedInstanceButton()
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

When('je clique sur le bouton "créer une instance"', function () {
  serviceProviderSandboxesSection.getCreateLinkedInstanceButton().click();
});

Then(
  /^l'alerte d'absence de bac à sable (est|n'est pas) affichée$/,
  function (text: string) {
    const isDisplayed = text === 'est';
    serviceProviderSandboxesSection
      .getSandboxesEmptyAlert()
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^le tableau des accès au bac à sable (est|n'est pas) affiché$/,
  function (text: string) {
    const isDisplayed = text === 'est';
    serviceProviderSandboxesSection
      .getSandboxesTable()
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

Then(
  /^l'instance "([^"]+)" (est|n'est pas) présente dans le tableau des accès au bac à sable$/,
  function (instanceName: string, text: string) {
    const isDisplayed = text === 'est';
    serviceProviderSandboxesSection
      .getSandboxTableRow(instanceName)
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

Then(
  "l'instance créée est présente dans le tableau des accès au bac à sable",
  function () {
    const { name: instanceName } = this.instance;
    serviceProviderSandboxesSection
      .getSandboxTableRow(instanceName)
      .should('be.visible');
  },
);

Then(
  "l'instance liée au fournisseur de service est à jour avec les informations Datapass",
  function () {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    serviceProviderSandboxesSection.checkFirstInstanceUpdated(
      partnersRootUrl,
      this.serviceProviderId,
    );
  },
);

Then(
  'les instances du fournisseur de service sont à jour avec les informations Datapass',
  function () {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    serviceProviderSandboxesSection.checkInstancesUpdated(
      partnersRootUrl,
      this.serviceProviderId,
    );
  },
);
