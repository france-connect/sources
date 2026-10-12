import { ChainableElement } from '../types';

export default class ServiceProviderContributorsSection {
  checkContributorInTable(email: string): void {
    this.getContributorRow(email).should('be.visible');
  }

  checkContributorNotInTable(email: string): void {
    cy.get('#service-provider-permissions--table').should(
      'not.contain.text',
      email.toLowerCase(),
    );
  }

  checkNoDeleteContributorButton(): void {
    cy.get('#service-provider-permissions--table')
      .find('[data-testid^="service-provider-permissions--delete-"]')
      .should('not.exist');
  }

  getAddContributorButton(): ChainableElement {
    return cy.get('[data-testid="service-provider-create-contributor-button"]');
  }

  getContributorAlert(): ChainableElement {
    return cy.get('[data-testid="service-provider-contributor-alert"]');
  }

  getContributorRow(email: string): ChainableElement {
    return cy
      .get('#service-provider-permissions--table')
      .contains('tbody tr', email.toLowerCase());
  }

  getDeleteContributorButton(email: string): ChainableElement {
    return this.getContributorRow(email).find(
      '[data-testid^="service-provider-permissions--delete-"]',
    );
  }

  getDeleteContributorModalConfirmButton(): ChainableElement {
    return cy.get('[data-testid="modal-confirm-button"]');
  }
}
