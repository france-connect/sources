import { ChainableElement } from '../../common/types';

export default class UdPreferencesPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  checkIsVisible(): void {
    cy.url().should('equal', `${this.udRootUrl}/preferences`);
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

  checkIsAlertErrorDisplayed(displayed: boolean): void {
    const errorAlert = this.getErrorAlert();
    const errorTitle =
      'Attention, vous devez avoir au moins un compte autorisé pour continuer a utiliser FranceConnect.';
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

  getBlockFutureIdpCheckbox(): ChainableElement {
    return this.getUserPreferencesForm().find(
      '[data-testid="field-checkbox-input"]',
    );
  }

  getBlockFutureIdpLabel(): ChainableElement {
    return this.getUserPreferencesForm().find(
      '[data-testid="field-checkbox-label"]',
    );
  }

  setFutureIdpAuthorization(isBlocked: boolean): void {
    this.getBlockFutureIdpCheckbox().then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');
      if (isChecked !== isBlocked) {
        this.getBlockFutureIdpLabel().click();
      }
    });
  }

  getSaveButton(): ChainableElement {
    return this.getUserPreferencesForm().find('button[type="submit"]');
  }

  checkIsUpdateNotificationDisplayed(): void {
    cy.contains(
      'Une notification récapitulant les modifications va vous être envoyée',
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
