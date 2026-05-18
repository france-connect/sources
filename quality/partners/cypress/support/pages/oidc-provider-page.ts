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

  getIdpAcrInput(): ChainableElement {
    return cy.get('input[name="acr"]');
  }

  getIdpConnectionButton(): ChainableElement {
    return cy.get('[type="submit"]');
  }

  getIdpCustomIdentityLink(): ChainableElement {
    return cy.get('#custom-identity-link');
  }

  private submitCustomIdentityForm(
    userDetails: Record<string, string>,
    acr: string,
  ): void {
    ['given_name', 'usual_name', 'email', 'uid'].forEach((key) => {
      if (userDetails[key]) {
        cy.get(`[name="${key}"]`).clearThenType(userDetails[key]);
      }
    });
    cy.get('[name="acr"]').clearThenType(acr);
    cy.get('button[type="submit"]').click();
  }

  checkIsVisible(): void {
    this.getEmailInput().should('be.visible');
  }

  checkIsIdpMockVisible(): void {
    this.getIdpUsernameInput().should('be.visible');
  }

  private loginWithProConnect(
    userDetails: Record<string, string>,
    acr: string,
  ): void {
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
    cy.get('#acr').clearThenType(acr);
    cy.get('#email').click();
    cy.contains('button[type="submit"]', 'Se connecter').click();
  }

  private loginWithIdpMock(
    { password, username }: UserCredentials,
    acr: string,
  ): void {
    this.checkIsIdpMockVisible();
    this.getIdpUsernameInput().clearThenType(username);
    this.getIdpPasswordInput().clearThenType(password);
    this.getIdpAcrInput().clearThenType(acr);
    this.getIdpConnectionButton().click();
  }

  private loginWithIdpMockUsingCustomIdentity(
    userDetails: Record<string, string>,
    acr: string,
  ): void {
    this.checkIsIdpMockVisible();
    this.getIdpCustomIdentityLink().click();
    this.submitCustomIdentityForm(userDetails, acr);
  }

  login(user: UserData, acr: string, withCustomIdentity = false): void {
    if (Cypress.env('TEST_ENV') === 'docker') {
      if (withCustomIdentity) {
        this.loginWithIdpMockUsingCustomIdentity(user.claims, acr);
      } else {
        this.loginWithIdpMock(user.credentials, acr);
      }
    } else {
      this.loginWithProConnect(user.claims, acr);
    }
  }
}
