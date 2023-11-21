import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  getIdentityProviderByDescription,
  navigateTo,
} from '../../common/helpers';
import { Environment } from '../../common/types';
import UdPreferencesPage from '../pages/ud-preferences-page';

let udPreferencesPage: UdPreferencesPage;

Given(
  'je navigue directement vers la page gestion des accès du dashboard usager',
  function () {
    const { allAppsUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-preferences', baseUrl: allAppsUrl });
  },
);

Given(
  'je navigue vers la page gestion des accès du dashboard usager',
  function () {
    const { allAppsUrl, udRootUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-preferences', baseUrl: allAppsUrl });
    udPreferencesPage = new UdPreferencesPage(udRootUrl);
    udPreferencesPage.checkIsVisible();
    // Wait for the IDP settings loading
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

Given(
  /^je suis (redirigé vers|sur) la page gestion des accès du dashboard usager$/,
  function () {
    const { udRootUrl }: Environment = this.env;
    udPreferencesPage = new UdPreferencesPage(udRootUrl);
    udPreferencesPage.checkIsVisible();
    // Wait for the IDP settings loading
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) le fournisseur d'identité$/,
  function (text: string) {
    const isAuthorized = text === "d'autoriser";
    const { name } = this.identityProvider;
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting.setIdpAuthorization(isAuthorized);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) (?:le|un) fournisseur d'identité "([^"]+)"$/,
  function (text: string, idpDescription: string) {
    const isAuthorized = text === "d'autoriser";
    const { name } = getIdentityProviderByDescription(
      this.identityProviders,
      idpDescription,
    );
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting.setIdpAuthorization(isAuthorized);
  },
);

When(
  /^je force le statut du fournisseur d'identité "([^"]+)" à l'état (autorisé|bloqué)$/,
  function (idpDescription: string, text: string) {
    const isAuthorized = text === 'autorisé';
    const { name } = getIdentityProviderByDescription(
      this.identityProviders,
      idpDescription,
    );
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting.setForceIdpAuthorization(isAuthorized);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) tous les fournisseurs d'identité$/,
  function (text: string) {
    const isAuthorized = text === "d'autoriser";
    udPreferencesPage.setAllIdpAuthorization(isAuthorized);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) les futurs fournisseurs d'identité$/,
  function (text: string) {
    const isAuthorized = text === "d'autoriser";
    udPreferencesPage.setFutureIdpAuthorization(isAuthorized);
  },
);

When(
  /^je réinitialise les préférences de la configuration par défaut$/,
  function () {
    udPreferencesPage.setAllIdpAuthorization(true);
    udPreferencesPage.setFutureIdpAuthorization(true);
    udPreferencesPage.getSaveButton().then(($btn) => {
      if ($btn.is(':disabled')) {
        return;
      } else {
        cy.wrap($btn).click();
        // Wait for the IDP settings loading
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.reload();
        // Wait for the IDP settings loading
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
      }
    });
  },
);

Then(
  /^les fournisseurs d'identité existants sont (autorisés|bloqués)$/,
  function (text: string) {
    const authorization = text === 'autorisés';
    udPreferencesPage.checkAllIdpAuthorization(authorization);
  },
);

Then(
  /^le fournisseur d'identité "([^"]+)" (est|n'est pas) blocable$/,
  function (idpDescription: string, text: string) {
    const isCheckboxEnabled = text === 'est';
    const { name } = getIdentityProviderByDescription(
      this.identityProviders,
      idpDescription,
    );
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting
      .getCheckbox()
      .should('be.checked')
      .should(isCheckboxEnabled ? 'be.enabled' : 'be.disabled');
  },
);

Then(
  /^le fournisseur d'identité "([^"]+)" est (autorisé|bloqué)$/,
  function (idpDescription: string, text: string) {
    const isAuthorized = text === 'autorisé';
    const { name } = getIdentityProviderByDescription(
      this.identityProviders,
      idpDescription,
    );
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting
      .getCheckbox()
      .should(isAuthorized ? 'be.checked' : 'not.to.be.checked');
  },
);

Then(
  /^les futurs fournisseurs d'identité sont (autorisés|bloqués)$/,
  function (text: string) {
    const status = text === 'autorisés';
    udPreferencesPage.checkFutureIdpAuthorization(status);
  },
);

Then(
  /^le message d'erreur "au moins un FI doit être autorisé" (est|n'est pas) affiché$/,
  function (text: string) {
    const isDisplayed = text === 'est';
    udPreferencesPage.checkIsAlertErrorDisplayed(isDisplayed);
  },
);

Then(
  /^le message d'information "autorisation des futurs fournisseurs d'identité" (est|n'est pas) affiché$/,
  function (text: string) {
    const isDisplayed = text === 'est';
    udPreferencesPage.checkIsFutureIdpAlertDisplayed(isDisplayed);
  },
);

Then(
  /^je confirme le message "autorisation des futurs fournisseurs d'identité"$/,
  function () {
    udPreferencesPage.confirmFutureIdpAlert();
  },
);

Then(
  /^le bouton "enregistrer mes réglages" est (actif|désactivé)$/,
  function (state) {
    const isEnabled = state === 'actif';
    udPreferencesPage
      .getSaveButton()
      .should(isEnabled ? 'be.enabled' : 'be.disabled');
  },
);

When(
  /^je décide (d'autoriser|de bloquer) les futurs fournisseurs d'identité par défaut$/,
  function (text: string) {
    const isAuthorized = text === "d'autoriser";
    udPreferencesPage.setFutureIdpAuthorization(isAuthorized);
  },
);

When('je clique sur le bouton "enregistrer mes réglages"', function () {
  udPreferencesPage.getSaveButton().click();
});

When("j'enregistre mes réglages d'accès", function () {
  udPreferencesPage.getSaveButton().click();
  udPreferencesPage.checkIsUpdateNotificationDisplayed();
});

Then(
  'le message "notification de modifications envoyée" est affiché',
  function () {
    udPreferencesPage.checkIsUpdateNotificationDisplayed();
  },
);

Then(
  /^le fournisseur d'identité "([^"]+)" (est|n'est pas) présent dans la liste$/,
  function (description: string, state: string) {
    const exist = state === 'est';
    const { name } = getIdentityProviderByDescription(
      this.identityProviders,
      description,
    );

    udPreferencesPage
      .getIdentityProviderSetting(name)
      .getComponent()
      .should(exist ? 'be.visible' : 'not.exist');
  },
);
