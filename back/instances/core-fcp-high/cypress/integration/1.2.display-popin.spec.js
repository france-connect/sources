import {
  setFSAuthorizeAcr,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('1.2 - numeric-identity-popin', () => {
  beforeEach(() => {
    cy.visit(Cypress.env(`SP1_ROOT_URL`));
    setFSAuthorizeAcr('eidas2');
    submitFSAuthorizeForm();
    cy.scrollTo('bottom');
  });

  it('should open numeric identity popin', () => {
    cy.get('#tuto-numeric-identity').click();
    cy.contains('Comment créer son identité numérique').should('be.visible');
  });

  it("should close numeric identity popin when clicking on 'Masquer'", () => {
    cy.get('#tuto-numeric-identity').click();
    cy.contains('Comment créer son identité numérique').should('be.visible');
    cy.get('#popin-close').click();
    cy.contains('Comment créer son identité numérique').should(
      'not.be.visible',
    );
  });

  it('should close numeric identity popin when clicking outside the popin', () => {
    cy.get('#tuto-numeric-identity').click();
    cy.contains('Comment créer son identité numérique').should('be.visible');
    cy.get('#numeric-identity').click({
      force: true,
    });
    cy.contains('Comment créer son identité numérique').should(
      'not.be.visible',
    );
  });
});
