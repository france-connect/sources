import { ChainableElement } from '../../common/types';

export default class UdPreferencesPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  checkIsVisible(): void {
    cy.url().should('equal', `${this.udRootUrl}/preferences`);
  }

  get userPreferencesForm(): ChainableElement {
    return cy.get('[data-testid="user-preferences-form"]');
  }

  get allIdentityProviderSettings(): ChainableElement {
    return cy.get('li[data-testid^="service-component-"]');
  }

  getIdentityProviderSetting(idpName: string): IdentityProviderSetting {
    return new IdentityProviderSetting(`service-component-${idpName}`);
  }

  get blockFutureIdpCheckbox(): ChainableElement {
    return this.userPreferencesForm.get('#allowFutureIdp');
  }

  get saveButton(): ChainableElement {
    return this.userPreferencesForm.get('button[type="submit"]');
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

  get idpSettingSelector() {
    return `li[data-testid="service-component-${this.name}"]`;
  }

  get image() {
    return cy.get(
      `${this.idpSettingSelector} [class*="ServiceComponent-image"]`,
    );
  }

  get checkbox() {
    return cy.get(`${this.idpSettingSelector} input[type="checkbox"]`);
  }

  get status() {
    return cy.get(
      `${this.idpSettingSelector} span[class*="FieldSwitchInputComponent-legend"]`,
    );
  }

  get description() {
    return cy.get(`${this.idpSettingSelector} label`);
  }

  setIdpAuthorization(isAuthorized: boolean): void {
    this.checkbox.then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');
      if (isChecked !== isAuthorized) {
        this.description.click();
      }
    });
  }
}
