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
  preferred_username: "Nom d'usage",
};
/* eslint-enable @typescript-eslint/naming-convention */

export default class InfoConsentPage {
  get consentCheckbox(): ChainableElement {
    return cy.get('#fc-ask-consent-checkbox');
  }

  get consentButton(): ChainableElement {
    return cy.get('#consent');
  }

  get showClaimsToggle(): ChainableElement {
    return cy.get('#toggleOpenCloseMenu');
  }

  get claimDetails(): ChainableElement {
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
      this.showClaimsToggle.should('be.visible');
      this.claimDetails.should('not.be.visible');
      this.showClaimsToggle.click();
    } else {
      // Consent page: Claims displayed without toggle
      this.showClaimsToggle.should('not.exist');
    }

    this.claimDetails.should('be.visible');
    this.claimDetails.invoke('text').then((text) => {
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
