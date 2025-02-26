import { ChainableElement } from '../types';

export default class InstanceFormPage {
  checkIsCreatePageVisible(): void {
    cy.get('[id="DTO2Form-instance-create"]').should('be.visible');
  }

  checkIsUpdatePageVisible(): void {
    cy.get('[id="DTO2Form-instance-update"]').should('be.visible');
  }

  getClientId(): Cypress.Chainable<string> {
    return cy.get('[name="client_id"]').invoke('val');
  }

  getCopyClientIdButton(): ChainableElement {
    return cy.get('[data-testid="form-input-text-client_id-copy-button"]');
  }

  getClientSecret(): Cypress.Chainable<string> {
    return cy.get('[name="client_secret"]').invoke('val');
  }

  getCopyClientSecretButton(): ChainableElement {
    return cy.get('[data-testid="form-input-text-client_secret-copy-button"]');
  }

  protected getAllFormInputs(): ChainableElement {
    return cy.get('input');
  }

  protected getActiveInputFromName(name: string): ChainableElement {
    return cy.get(`[name="${name}"]:not([type="hidden"]):not([disabled])`);
  }

  protected getVisibleInputFromName(name: string): ChainableElement {
    return cy.get(`[name="${name}"]:not([type="hidden"])`);
  }

  protected getInputErrorMessagesFromName(name: string): ChainableElement {
    return cy.get(`[data-testid="${name}-messages"].fr-message--error`);
  }

  getInputAddButton(key: string): ChainableElement {
    return cy.get(`[data-testid="${key}-add"]`);
  }

  getInputRemoveButton(name: string): ChainableElement {
    return cy.get(`[data-testid="${name}-remove"]`);
  }

  getValidationButton(): ChainableElement {
    return cy.get("[type='submit']");
  }

  fillValue(name: string, value: string | string[]): void {
    this.getActiveInputFromName(name).then(($elem) => {
      if ($elem.attr('type') === 'checkbox') {
        cy.wrap($elem).each(($el) => {
          if ($el.is(':checked')) {
            $el.prop('checked', false);
          }
        });
        cy.wrap($elem).check(value, { force: true });
      } else if ($elem.attr('type') === 'radio') {
        cy.wrap($elem).check(value, { force: true });
        cy.wrap($elem).filter(':checked').trigger('change', { force: true });
      } else if ($elem.is('select')) {
        cy.wrap($elem).select(value);
      } else {
        cy.wrap($elem).clear();
        if (value && typeof value === 'string') {
          cy.wrap($elem).type(value);
        }
      }
    });
  }

  fillDefaultValues(values: Record<string, string | string[]>): void {
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

  checkIsFieldVisible(name: string, isVisible: boolean): void {
    const state = isVisible ? 'be.visible' : 'not.exist';
    this.getVisibleInputFromName(name).should(state);
  }

  checkIsFieldWithinViewport(name: string, isWithinViewport: boolean): void {
    this.getVisibleInputFromName(name).checkWithinViewport(isWithinViewport);
  }

  checkHasValue(name: string, value: string): void {
    this.getVisibleInputFromName(name).should('have.value', value);
  }

  checkHasError(name: string, hasError: boolean): void {
    const state = hasError ? 'exist' : 'not.exist';
    this.getInputErrorMessagesFromName(name).should(state);
  }

  checkHasErrorMessage(name: string, errorMessage: string): void {
    this.getInputErrorMessagesFromName(name).should('contain', errorMessage);
  }

  checkHasCheckboxValues(name: string, values: string[]): void {
    const allCheckedValues: string[] = [];
    this.getVisibleInputFromName(name)
      .each(($el) => {
        if ($el.is(':checked')) {
          allCheckedValues.push($el.attr('value'));
        }
      })
      .then(() => {
        expect(allCheckedValues)
          .to.include.members(values)
          .to.have.length(values.length);
      });
  }

  checkAreCheckboxesDisabled(name: string, isDisabled: boolean): void {
    this.getVisibleInputFromName(name).each(($el) =>
      expect($el.is(':disabled')).to.eq(isDisabled),
    );
  }

  checkHasListSelectedOptionLabel(name: string, value: string): void {
    this.getVisibleInputFromName(name)
      .find(':selected')
      .should('contain', value);
  }
}
