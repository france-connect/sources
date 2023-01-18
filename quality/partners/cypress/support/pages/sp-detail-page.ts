import { ChainableElement } from '../types';
import SPConfigurationComponent from './sp-configuration-component';

export default class SPDetailPage {
  checkIsVisible(): void {
    this.getSpName().should('be.visible');
  }

  getReturnToSpListButton(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderHeaderComponent-return-sp-list-button"]',
    );
  }

  getSpBadge(): ChainableElement {
    return cy.get('[data-testid="ServiceProviderHeaderComponent-badge"]');
  }

  getSpName(): ChainableElement {
    return cy.get('[data-testid="ServiceProviderHeaderComponent-spName"]');
  }

  getPlatformName(): ChainableElement {
    return cy.get('[data-testid="ServiceProviderHeaderComponent-platform"]');
  }

  getSandboxConfigContainer(): ChainableElement {
    return cy.get('[data-testid="ServiceProviderSandboxComponent-container"]');
  }

  checkIsEditMode(): void {
    this.getSandboxConfigContainer().should('be.visible');
  }

  checkIsViewMode(): void {
    this.getSandboxConfigContainer().should('not.exist');
  }

  // Index starting with 0
  getSPConfiguration(index: number): SPConfigurationComponent {
    return new SPConfigurationComponent(index);
  }

  getAllSPConfigurations(): ChainableElement {
    return cy.get('section[data-testid^="AccordionComponent"]');
  }

  getAddSPConfigurationButton(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderSandboxComponent-add-config-button"]',
    );
  }
}
