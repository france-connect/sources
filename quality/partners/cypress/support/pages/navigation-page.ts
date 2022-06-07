import { ChainableElement, Environment, User } from '../types';

export default class NavigationPage {
  checkIsConnected(): void {
    this.getLogoutButton().should('be.visible');
  }

  getUserFirstAndLastname(): ChainableElement {
    return cy.get('span[data-testid="layout-header-tools-account-component-desktop"]');
  }

  checkIsUsernameDisplayed(user: User): void {
    const { firstname, lastname } = user;
    this.getUserFirstAndLastname()
      .should('be.visible')
      .should('have.text', `${firstname} ${lastname}`);
  }

  getLogoutButton(): ChainableElement {
    return cy.get('a[data-testid="layout-header-tools-logout-button-desktop"]');
  }

  visitHomePage({ partnersUrl }: Environment): void {
    cy.visit(partnersUrl);
  }
}
