import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import InstanceCard from '../../pages/instance-card';
import InstancesListPage from '../../pages/instances-list-page';

const instancesListPage = new InstancesListPage();
let currentInstanceCard: InstanceCard;

Then(/^je suis (redirigé vers|sur) la page liste des instances$/, function () {
  instancesListPage.checkIsVisible();
});

Then(
  /^la confirmation de création de l'instance (est|n'est pas) affichée$/,
  function (text: string) {
    const isVisible = text === 'est';
    instancesListPage.checkIsInstanceCreationConfirmationVisible(isVisible);
  },
);

Then(
  /^la confirmation de modification de l'instance (est|n'est pas) affichée$/,
  function (text: string) {
    const isVisible = text === 'est';
    instancesListPage.checkIsInstanceUpdateConfirmationVisible(isVisible);
  },
);

When(
  /^je masque la confirmation de (création|modification) de l'instance$/,
  function () {
    instancesListPage.hideConfirmationMessage();
  },
);

Then(
  /^la tuile de création d'instance (est|n'est pas) affichée$/,
  function (text: string) {
    const isVisible = text === 'est';
    instancesListPage
      .getCreateInstanceTile()
      .should(isVisible ? 'be.visible' : 'not.exist');
  },
);

Then("je clique sur la tuile de création d'instance", function () {
  instancesListPage.getCreateInstanceTile().click();
});

When("je clique sur le lien d'ajout d'une instance", function () {
  instancesListPage.getAddInstanceLink().click();
});

When('je clique sur la première instance', function () {
  instancesListPage.getInstanceCard(0).getCardButton().click();
});

When("je clique sur l'instance {string}", function (instanceName: string) {
  instancesListPage.findInstanceCard(instanceName).then((instanceCard) => {
    expect(instanceCard).to.exist;
    instanceCard.getCardButton().click();
  });
});

Then("aucune instance n'est affichée", function () {
  instancesListPage.getAllInstanceCards().should('not.exist');
});

Then(/^(\d+) instances? (?:est|sont) affichées?$/, function (count: number) {
  instancesListPage
    .getAllInstanceCards()
    .should('be.visible')
    .should('have.length', count);
});

When("l'instance {string} est affichée", function (instanceName: string) {
  instancesListPage.findInstanceCard(instanceName).then((instanceCard) => {
    expect(instanceCard).to.exist;
    currentInstanceCard = instanceCard;
  });
});

When(/^l'instance (?:créée|modifiée) est affichée$/, function () {
  expect(this.instance).to.exist;
  const { name: instanceName } = this.instance;
  instancesListPage.findInstanceCard(instanceName).then((instanceCard) => {
    expect(instanceCard).to.exist;
    currentInstanceCard = instanceCard;
  });
});

Then(/^le nom de l'instance est "([^"]*)"$/, function (instanceName: string) {
  currentInstanceCard.getInstanceName().should('have.text', instanceName);
});

Then("le nom de l'instance est affiché", function () {
  expect(this.instance).to.exist;
  const { name: instanceName } = this.instance;
  currentInstanceCard.getInstanceName().should('have.text', instanceName);
});

Then(/^la date de création de l'instance est affichée$/, function () {
  currentInstanceCard
    .getCreationDate()
    .invoke('text')
    .should('contains', 'Créée le :');
});

Then(`le "client_id" de l'instance est affiché`, function () {
  currentInstanceCard.checkIsClientIdDisplayed();
});

Then(`le "client_secret" de l'instance est affiché`, function () {
  currentInstanceCard.checkIsClientSecretDisplayed();
});

Given('je mémorise le "client_id" de la première instance', function () {
  instancesListPage.getInstanceCard(0).checkIsClientIdDisplayed();
  instancesListPage.getInstanceCard(0).getClientId().as('client_id');
});

Given('je mémorise le "client_secret" de la première instance', function () {
  instancesListPage.getInstanceCard(0).checkIsClientIdDisplayed();
  instancesListPage.getInstanceCard(0).getClientSecret().as('client_secret');
});
