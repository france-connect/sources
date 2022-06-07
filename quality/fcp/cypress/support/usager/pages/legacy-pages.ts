/**
 * Page definitions for FranceConnect Legacy
 * with the minimum amount of UI elements to perform high level workflows.
 * Those pages are used for the user-dashboard tests.
 */

import { ChainableElement, IdentityProvider } from '../../common/types';

export class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('#error-section').should('be.visible');
  }

  checkErrorCode(errorCode: string): void {
    cy.get('#error-code').contains(errorCode);
  }

  checkErrorMessage(message: string): void {
    cy.get('h1.main-title').contains(message);
  }
}

export class IdentityProviderSelectionPage {
  getIdpGrid(): ChainableElement {
    return cy.get('.main-providers');
  }

  getIdpButton(idp: IdentityProvider): ChainableElement {
    return cy.get(idp.selectors.idpButton);
  }

  checkIsVisible(): void {
    this.getIdpGrid().should('be.visible');
  }
}

export class InfoConsentPage {
  get consentButton(): ChainableElement {
    return cy.get('button.content__continue');
  }
}
