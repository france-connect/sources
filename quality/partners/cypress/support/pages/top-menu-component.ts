import { ChainableElement } from '../types';

export default class TopMenuComponent {
  getUserLabel(): ChainableElement {
    return cy.get(
      '.fr-header__tools [data-testid="layout-header-tools-account-component"]',
    );
  }

  getLogoutLink(): ChainableElement {
    return cy.get(
      '.fr-header__tools [data-testid="layout-header-tools-logout-button"]',
    );
  }

  getOpenMobileMenuButton(): ChainableElement {
    return cy.get('[data-testid="burger-button-mobile-menu"]');
  }

  checkIsUserConnected(isConnected = true): void {
    const state = isConnected ? 'be.visible' : 'not.exist';
    this.getLogoutLink().should(state);
  }
}
