import { ChainableElement } from '../types';

export default class ServiceProviderCreateContributorPage {
  checkIsVisible(): void {
    cy.get('#Dto2Form-contributor-create').should('be.visible');
  }

  getTitle(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-create-contributor-page-title"]',
    );
  }

  getValidationButton(): ChainableElement {
    return cy.get('#Dto2Form-contributor-create').find("[type='submit']");
  }

  getFormErrorAlert(): ChainableElement {
    return cy.get('#Dto2Form-contributor-create').find('.fr-alert--error');
  }

  getInputErrorMessagesFromName(name: string): ChainableElement {
    return cy.get(`[data-testid="${name}-messages"].fr-message--error`);
  }

  fillValue(name: string, value: string): void {
    cy.get(`[name="${name}"]:not([type="hidden"])`).then(($elem) => {
      cy.wrap($elem).clear();
      if (value) {
        cy.wrap($elem).type(value);
      }
    });
  }

  checkHasError(name: string, hasError: boolean): void {
    const state = hasError ? 'exist' : 'not.exist';
    this.getInputErrorMessagesFromName(name).should(state);
  }

  checkHasErrorMessage(name: string, errorMessage: string): void {
    this.getInputErrorMessagesFromName(name).should('contain', errorMessage);
  }
}
