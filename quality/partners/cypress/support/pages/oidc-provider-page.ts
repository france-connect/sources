import { ChainableElement, UserCredentials } from '../types';

const IDP_MOCK_EMAIL = 'test@fia1.fr';

export default class OidcProviderPage {
  getEmailInput(): ChainableElement {
    return cy.get('#email-input');
  }

  getConnectionButton(): ChainableElement {
    return cy.get('[data-testid="interaction-connection-button"]');
  }

  getIdpUsernameInput(): ChainableElement {
    return cy.get('input[name="login"]');
  }

  getIdpPasswordInput(): ChainableElement {
    return cy.get('input[name="password"]');
  }

  getIdpConnectionButton(): ChainableElement {
    return cy.get('[type="submit"]');
  }

  checkIsVisible(): void {
    this.getEmailInput().should('be.visible');
  }

  checkIsIdpMockVisible(): void {
    this.getIdpUsernameInput().should('be.visible');
  }

  // Login function not used as we use ProConnect mock
  private loginWithProConnect(credentials: UserCredentials): void {
    this.checkIsVisible();
    this.getEmailInput().clearThenType(IDP_MOCK_EMAIL);
    this.getConnectionButton().click();
    this.loginWithIdpMock(credentials);
  }

  private loginWithIdpMock({ password, username }: UserCredentials): void {
    this.checkIsIdpMockVisible();
    this.getIdpUsernameInput().clearThenType(username);
    this.getIdpPasswordInput().clearThenType(password);
    this.getIdpConnectionButton().click();
  }

  login(credentials: UserCredentials): void {
    this.loginWithIdpMock(credentials);
  }
}
