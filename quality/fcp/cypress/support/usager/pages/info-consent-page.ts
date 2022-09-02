import { ChainableElement, ScopeContext } from '../../common/types';
import { getClaims } from '../helpers';

/* eslint-disable @typescript-eslint/naming-convention */
const CLAIM_LABELS = {
  address: 'Adresse postale',
  birthcountry: 'Pays de naissance',
  birthdate: 'Date de naissance',
  birthplace: 'Lieu de naissance',
  email: 'Adresse email',
  family_name: 'Nom de naissance',
  gender: 'Sexe',
  given_name: 'Prénom(s)',
  phone_number: 'Téléphone',
  preferred_username: 'Nom d’usage',
};
/* eslint-enable @typescript-eslint/naming-convention */

export default class InfoConsentPage {
  getConsentCheckbox(): ChainableElement {
    return cy.get('#fc-ask-consent-checkbox');
  }

  getConsentButton(): ChainableElement {
    return cy.get('#consent');
  }

  getShowClaimsToggle(): ChainableElement {
    return cy.get('#toggleOpenCloseMenu');
  }

  getClaimDetails(): ChainableElement {
    return cy.get('.content-details__content ul');
  }

  checkIsVisible(): void {
    cy.url().should('match', /\/api\/v2\/interaction\/[0-9a-z_-]+\/consent/i);
  }

  checkAnonymousScope(): void {
    cy.get('.section__identity').contains(
      'Vous avez été connecté de façon anonyme',
    );
    cy.get('.section__more-info').contains(
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
    } else {
      // Consent page: Claims displayed without toggle
      this.getShowClaimsToggle().should('not.exist');
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
