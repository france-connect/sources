import { ChainableElement } from '../../common/types';

export default class UdFraudFormPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  checkHasFraudSurveyOriginQueryParam(fraudSurveyOrigin: string): void {
    cy.url().should('include', `?fraudSurveyOrigin=${fraudSurveyOrigin}`);
  }

  checkIsVisible(): void {
    const formUrl = `${this.udRootUrl}/fraud/form`;
    cy.url().should('include', formUrl);
  }

  protected getAllFormInputs(): ChainableElement {
    return cy.get('input:not([type="hidden"]), textarea');
  }

  getVisibleInputFromName(name: string): ChainableElement {
    return cy.get(`[name=${name}]:not([type="hidden"])`);
  }

  getConsentCheckbox(): ChainableElement {
    return cy.get('[name=acceptTransmitData]');
  }

  getHistoryLink(): ChainableElement {
    return cy.get('[data-testid="history-link"]');
  }

  getErrorMessageFromName(name: string): ChainableElement {
    return cy.get(`[id=${name}-error-desc]`);
  }

  fillValue(name: string, value: string): void {
    this.getVisibleInputFromName(name).then(($elem) => {
      // clearThenType() command doesn't work on the idp settings modal
      // Force Cypress to accept chaining clear and type commands
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.wrap($elem).clear().type(value);
    });
  }

  clearValue(name: string): void {
    this.getVisibleInputFromName(name).then(($elem) => {
      cy.wrap($elem).clear();
    });
  }

  fillDefaultValues(values: Record<string, string>): void {
    const elementAlreadySet: string[] = [];
    this.getAllFormInputs().each(($el) => {
      const elementName = $el.attr('name');
      const value = values[elementName];
      // If the html element has not been set already and a value exists
      if (!elementAlreadySet.includes(elementName) && value) {
        this.fillValue(elementName, value);
        elementAlreadySet.push(elementName);
      }
    });
  }

  checkHasValue(name: string, value: string): void {
    this.getVisibleInputFromName(name).should('have.value', value);
  }

  checkIsSuccessAlertDisplayed(): void {
    cy.get('[data-testid="success-alert"]').contains(
      'Votre demande a bien été prise en compte',
    );
  }

  checkIsErrorMessageDisplayed(name: string): void {
    this.getErrorMessageFromName(name).should('be.visible');
  }

  checkHasErrorMessage(name: string, errorMessage: string): void {
    this.getErrorMessageFromName(name)
      .invoke('text')
      .should('contain', errorMessage);
  }

  getValidationButton(): ChainableElement {
    return cy.get('[data-testid="fraud-form-submit-button"]');
  }

  getFraudSurveyButton(): ChainableElement {
    return cy.get('[data-testid="fraud-survey-button"]');
  }

  validateForm(): void {
    this.getValidationButton().click();
  }
}
