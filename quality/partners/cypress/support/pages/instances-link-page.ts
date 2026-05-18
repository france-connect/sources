import { ChainableElement } from '../types';

export default class InstancesLinkPage {
  getLinkInstancesTable(): ChainableElement {
    return cy.get('#link-instances-table');
  }

  getSelectAllInstancesCheckbox(): ChainableElement {
    return cy.get('#link-instances-select-all');
  }

  getAllInstanceCheckboxes(): ChainableElement {
    return this.getLinkInstancesTable().find('input[type="checkbox"]');
  }

  getInstanceCheckboxByName(instanceName: string): ChainableElement {
    return this.getLinkInstancesTable()
      .contains('[data-testid="field-checkbox-label"]', instanceName)
      .prev('input[type="checkbox"]');
  }

  getLinkInstancesSubmitButton(): ChainableElement {
    return cy.contains('button', 'Relier les instances');
  }

  getLinkInstancesCancelButton(): ChainableElement {
    return cy.contains('button', 'Annuler');
  }
}
