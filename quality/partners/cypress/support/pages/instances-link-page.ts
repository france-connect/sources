import { ChainableElement } from '../types';

export default class InstancesLinkPage {
  getLinkInstancesTable(): ChainableElement {
    return cy.get('#service-provider-link-instances--table');
  }

  getSelectAllInstancesCheckbox(): ChainableElement {
    return cy.get('#service-provider-link-instances--select-all');
  }

  getAllInstanceCheckboxes(): ChainableElement {
    return this.getLinkInstancesTable().find('input[type="checkbox"]');
  }

  getInstanceCheckboxByName(instanceName: string): ChainableElement {
    return this.getLinkInstancesTable()
      .contains('tbody tr', instanceName)
      .find('input[type="checkbox"]');
  }

  getLinkInstancesSubmitButton(): ChainableElement {
    return cy.contains('button', 'Relier les bacs à sable');
  }

  getLinkInstancesCancelButton(): ChainableElement {
    return cy.contains('button', 'Annuler');
  }
}
