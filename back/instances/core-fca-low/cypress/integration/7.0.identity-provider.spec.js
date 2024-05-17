import {
  basicSuccessScenario,
  getAuthorizeUrl,
  getIdentityProvider,
  getServiceProvider,
  submitFSAuthorizeForm,
} from './mire.utils';

const identityProviderId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

describe('Idp activation & visibility', () => {
  const { ID, IDP_INTERACTION_URL, TITLE } =
    getIdentityProvider(identityProviderId);

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should redirect to an existing idp', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    basicSuccessScenario(identityProviderId);
    const { IDP_INTERACTION_URL } = getIdentityProvider(ID);

    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should trigger error Y470001 if the CSRF token is not valid', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get('input[name="csrfToken"]').invoke(
      'attr',
      'value',
      'INVALID-CSRF-VALUE',
    );
    // When
    basicSuccessScenario(identityProviderId);
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y470001');
  });

  describe('No app restart needed', () => {
    const spId = `${Cypress.env('SP_NAME')}1-low`;

    beforeEach(() => {
      cy.resetdb();
    });

    it('should update an identity provider properties, activate it, without an app restart needed', () => {
      const { SP_ROOT_URL } = getServiceProvider(spId);
      const idpId = '0e7c099f-fe86-49a0-b7d1-19df45397212';

      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();
      basicSuccessScenario(idpId);

      // should redirect to idp with no updated data
      const { IDP_INTERACTION_URL } = getIdentityProvider(idpId);
      cy.url().should('include', IDP_INTERACTION_URL);

      cy.get('.title').should('not.contain', 'Idp test Updated, activated');

      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();

      cy.e2e('fca_idp_update_desactivate');
      cy.wait(500);
      cy.reload();

      basicSuccessScenario(idpId);

      // should redirect to error page because idp is desactivated
      cy.url().should('include', '/api/v2/redirect-to-idp');

      cy.get('[data-testid=error-section]').should(
        'contain',
        'code erreur : Y500017',
      );
    });

    it('should remove an identity provider without an app restart needed', () => {
      const { SP_ROOT_URL } = getServiceProvider(spId);
      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();
      cy.get('.interaction-main-content-form').should(
        'not.contain',
        'Idp test Inserted',
      );

      cy.e2e('fca_idp_insert');
      cy.wait(500);
      cy.reload();

      cy.e2e('fca_idp_remove');
      cy.wait(500);
      cy.reload();

      cy.get('.interaction-main-content-form').should(
        'not.contain',
        'Idp test Inserted',
      );
    });
  });
});
