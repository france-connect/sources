import { ChainableElement } from '../types';

export default class InstanceFormPage {
  checkIsCreatePageVisible(): void {
    cy.get('[id="DTO2Form-instance-create"]').should('be.visible');
  }

  checkIsUpdatePageVisible(): void {
    cy.get('[id="DTO2Form-instance-update"]').should('be.visible');
  }

  protected getAllFormInputs(): ChainableElement {
    return cy.get('input');
  }

  protected getActiveInputFromName(name: string): ChainableElement {
    return cy.get(`[name=${name}]:not([type="hidden"]):not([disabled])`);
  }

  protected getVisibleInputFromName(name: string): ChainableElement {
    return cy.get(`[name=${name}]:not([type="hidden"])`);
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
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.wrap($elem)
          .clear()
          .type(value as string);
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

  checkHasValue(name: string, value: string): void {
    this.getVisibleInputFromName(name).should('have.value', value);
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
