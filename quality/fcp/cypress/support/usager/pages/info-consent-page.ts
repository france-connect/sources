import { ChainableElement, ScopeContext } from '../../common/types';
import { getClaims } from '../helpers';

/* eslint-disable @typescript-eslint/naming-convention */
const CLAIM_LABELS = {
  address: 'Adresse postale',
  birthcountry: 'Pays de naissance',
  birthdate: 'Date de naissance',
  birthplace: 'Lieu de naissance',
  connexion_tracks: 'Historique de connexions',
  email: 'Adresse email',
  family_name: 'Nom de naissance',
  gender: 'Sexe',
  given_name: 'Prénom(s)',
  preferred_username: 'Nom d’usage',
};
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

  checkInformationConsent(
    scopeContext: ScopeContext,
    explicitConsent: boolean,
  ): void {
    const expectedClaims = getClaims(scopeContext).filter(
      (claimName) => claimName !== 'sub',
    );

    if (!explicitConsent) {
      // Information page: Use the toggle to display the claims
      this.getShowClaimsToggle().should('be.visible');
      this.getClaimDetails().should('not.be.visible');
      this.getShowClaimsToggle().click();
    }

    this.getClaimDetails().should('be.visible');
    this.getClaimDetails()
      .invoke('text')
      .then((text) => {
        const arrClaims = text.trim().split(/\s\s+/);
        // Check all expected claims
        expectedClaims.forEach((claimName) =>
          expect(arrClaims).include(CLAIM_LABELS[claimName]),
        );
        // Check no other claims
        expect(arrClaims.length).to.equal(
          expectedClaims.length,
          `The claims count should be ${expectedClaims.length}`,
        );
      });
  }
}
