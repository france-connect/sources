import { ChainableElement } from '../../common/types';

export default class UdPreferencesPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  checkIsVisible(): void {
    cy.url().should('equal', `${this.udRootUrl}/preferences`);
    cy.contains('h1', 'Pourquoi gérer mes accès dans FranceConnect ?');
  }

  getUserPreferencesForm(): ChainableElement {
    return cy.get('[data-testid="user-preferences-form"]');
  }

  getAllIdentityProviderSettings(): ChainableElement {
    return cy.get('li[data-testid^="service-component-"]');
  }

  getIdentityProviderSetting(idpName: string): IdentityProviderSetting {
    return new IdentityProviderSetting(`service-component-${idpName}`);
  }

  setAllIdpAuthorization(isAuthorized: boolean): void {
    this.getAllIdentityProviderSettings().each(($li) => {
      const dataTestId = $li.attr('data-testid');
      const idpSetting = new IdentityProviderSetting(dataTestId);
      idpSetting.setIdpAuthorization(isAuthorized);
    });
  }

  getErrorAlert(): ChainableElement {
    return cy.get('.fr-alert--error');
  }

  getInfoAlert(): ChainableElement {
    return cy.get('.fr-alert--info');
  }

  checkIsAlertErrorDisplayed(displayed: boolean): void {
    const errorAlert = this.getErrorAlert();
    const errorTitle =
      'Attention, vous devez avoir au moins un compte autorisé pour continuer à utiliser FranceConnect.';
    const errorMessage =
      'Veuillez choisir au moins un compte autorisé pour pouvoir enregistrer vos réglages.';
    if (displayed) {
      errorAlert
        .invoke('text')
        .should('contain', errorTitle)
        .should('contain', errorMessage);
    } else {
      errorAlert.should('not.exist');
    }
  }

  checkIsFutureIdpAlertDisplayed(displayed: boolean): void {
    const infoAlert = this.getInfoAlert();
    const infoTitle =
      'Êtes-vous sûr de vouloir autoriser par défaut les futurs moyens de connexion';
    if (displayed) {
      infoAlert
        .should('be.visible')
        .invoke('text')
        .should('contain', infoTitle);
    } else {
      infoAlert.should('not.exist');
    }
  }

  getAllowFutureIdpCheckbox(): ChainableElement {
    return this.getUserPreferencesForm().find(
      '[data-testid="field-toggle-input-allowFutureIdp"]',
    );
  }

  getAllowFutureIdpLabel(): ChainableElement {
    return this.getUserPreferencesForm().find(
      '[data-testid="field-toggle-label-allowFutureIdp"]',
    );
  }

  setFutureIdpAuthorization(isAuthorized: boolean): void {
    this.getAllowFutureIdpCheckbox().then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');
      if (isChecked !== isAuthorized) {
        this.getAllowFutureIdpLabel().click();
      }
    });
  }

  confirmFutureIdpAlert(): void {
    cy.get('[data-testid="UserPreferenceFormComponent-button-info"]').click();
  }

  getSaveButton(): ChainableElement {
    return this.getUserPreferencesForm().find('button[type="submit"]');
  }

  checkIsUpdateNotificationDisplayed(): void {
    cy.contains(
      'Une notification récapitulant les modifications va vous être envoyée',
    );
  }

  checkAllIdpAuthorization(isAuthorized: boolean): void {
    this.getAllIdentityProviderSettings().each(($li) => {
      const dataTestId = $li.attr('data-testid');
      const idpSetting = new IdentityProviderSetting(dataTestId);
      idpSetting
        .getCheckbox()
        .should(isAuthorized ? 'be.checked' : 'not.be.checked');
    });
  }

  checkFutureIdpAuthorization(isAuthorized: boolean): void {
    this.getAllowFutureIdpCheckbox().should(
      isAuthorized ? 'be.checked' : 'not.be.checked',
    );
  }
}

class IdentityProviderSetting {
  dataTestId: string;
  name: string;

  constructor(dataTestId) {
    this.dataTestId = dataTestId;
    this.name = dataTestId.replace('service-component-', '');
  }

  getIdpSettingSelector() {
    return `li[data-testid="service-component-${this.name}"]`;
  }

  getComponent() {
    return cy.get(this.getIdpSettingSelector());
  }

  getImage() {
    return cy.get(
      `${this.getIdpSettingSelector()} [class*="ServiceComponent-image"]`,
    );
  }

  getCheckbox() {
    return cy.get(`${this.getIdpSettingSelector()} input[type="checkbox"]`);
  }

  getStatus() {
    return cy.get(
      `${this.getIdpSettingSelector()} span[class*="FieldSwitchInputComponent-legend"]`,
    );
  }

  getDescription() {
    return cy.get(`${this.getIdpSettingSelector()} label`);
  }

  setIdpAuthorization(isAuthorized: boolean): void {
    this.getCheckbox().then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');
      if (isChecked !== isAuthorized) {
        this.getDescription().click();
      }
    });
  }
}
