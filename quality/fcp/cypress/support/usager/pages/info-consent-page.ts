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

  // TODO: To delete once FC+ uses DSFR design
  checkAnonymousScopeFcPlus(): void {
    cy.get('[data-testid="anonymous-title"]').contains(
      'Vous avez été connecté de façon anonyme',
    );
    cy.get('[data-testid="anonymous-complementary"]').contains(
      "Aucune donnée n'a été échangée pour vous connecter.",
    );
  }

  // TODO: Use this once both FC low and high use dsfr
  checkClaimsAccordionIsExpended(): void {
    cy.get('[id="accordion-consent"]').should(
      'have.class',
      'fr-collapse--expanded',
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
      this.getShowClaimsToggle().click();
      // Due to accordion animation
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }

    this.getClaimDetails().should('be.visible');
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
