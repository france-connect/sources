import { ChainableElement } from '../types';

export default class ServiceProviderContributorsSection {
  checkContributorInTable(email: string): void {
    cy.get('#service-provider-permissions')
      .contains('tbody tr', email.toLowerCase())
      .should('be.visible');
  }

  getAddContributorButton(): ChainableElement {
    return cy.get('[data-testid="service-provider-create-contributor-button"]');
  }
}
