import { ChainableElement, ScopeContext } from '../../common/types';
import { getClaimsWithoutRnippPrefix } from '../helpers';
/* eslint-enable @typescript-eslint/naming-convention */

export default class InfoConsentPage {
  getConsentCheckbox(): ChainableElement {
    return cy.get('[data-testid="checkbox-consent"]');
  }

  getConsentCheckboxLabel(): ChainableElement {
    return cy.get('[data-testid="label-consent"]');
  }

  getConsentButton(): ChainableElement {
    return cy.get('[data-testid="consent-continue"]');
  }

  getShowClaimsToggle(): ChainableElement {
    return cy.get('[data-testid="consent-accordion-toggle"]');
  }

  getClaimDetails(): ChainableElement {
    return cy.get('[data-testid="consent-detail"]');
  }

  getClaimDetailsItems(): ChainableElement {
    return cy.get('[data-testid="consent-detail"] li');
  }

  checkIsVisible(): void {
    this.getConsentButton().should('be.visible');
  }

  checkAnonymousScope(): void {
    cy.get('[data-testid="anonymous-title"]').contains(
      'Vous allez vous connecter de façon anonyme',
    );
    cy.get('[data-testid="anonymous-complementary"]').contains(
      'Aucune donnée personnelle ne sera transmise',
    );
  }

  checkInformationConsent(
    scopeContext: ScopeContext,
    explicitConsent: boolean,
  ): void {
    // Retrieve distinct claims without rnipp_ prefix.
    const expectedClaimsSet: Set<string> =
      getClaimsWithoutRnippPrefix(scopeContext);

    if (!explicitConsent) {
      // Information page: Use the toggle to display the claims
      this.getShowClaimsToggle().should('be.visible');
      this.getClaimDetails().should('not.be.visible');
      // Wait for element to be bound to click event
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      this.getShowClaimsToggle().click();
    }

    this.getClaimDetailsItems().last().should('be.visible');

    this.getClaimDetails()
      .invoke('text')
      .then((text) => {
        const arrClaims = text.trim().split(/\s\s+/);
        // Check all expected claims
        expectedClaimsSet.forEach((claimLabel) =>
          expect(arrClaims).include(claimLabel),
        );
        // Check no other claims
        expect(arrClaims.length).to.equal(
          expectedClaimsSet.size,
          `The claims count should be ${expectedClaimsSet.size}`,
        );
      });
  }
}
