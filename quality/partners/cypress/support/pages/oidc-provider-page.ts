import { ChainableElement, UserCredentials, UserData } from '../types';

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

  private loginWithProConnect(userDetails: Record<string, string>): void {
    this.checkIsVisible();
    this.getEmailInput().clearThenType(IDP_MOCK_EMAIL);
    this.getConnectionButton().click();
    // Login on ProConnect IDP mock
    cy.get('#email').should('be.visible');
    cy.get('#open-custom-configuration').click();
    ['email', 'given_name', 'usual_name', 'is_service_public', 'sub'].forEach(
      (key) => {
        if (userDetails[key]) {
          cy.get(`#${key}`).clearThenType(userDetails[key]);
        }
      },
    );
    cy.get('#email').click();
    cy.contains('button[type="submit"]', 'Se connecter').click();
  }

  private loginWithIdpMock({ password, username }: UserCredentials): void {
    this.checkIsIdpMockVisible();
    this.getIdpUsernameInput().clearThenType(username);
    this.getIdpPasswordInput().clearThenType(password);
    this.getIdpConnectionButton().click();
  }

  login(user: UserData): void {
    if (Cypress.env('TEST_ENV') === 'docker') {
      this.loginWithIdpMock(user.credentials);
    } else {
      this.loginWithProConnect(user.claims);
    }
  }
}
