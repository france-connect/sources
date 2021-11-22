import {
  getAuthorizeUrl,
  getIdentityProvider,
  getServiceProvider,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('Idp activation & visibility', () => {
  // -- replace by either `fip` or `fia`
  const idpId = `${Cypress.env('IDP_NAME')}`;
  const { IDP_INTERACTION_URL, MINISTRY_NAME, TITLE } = getIdentityProvider(
    `${idpId}1-low`,
  );

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should display active and visible IdP', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get('#fi-search-term').type(MINISTRY_NAME);
    cy.get(
      '#identity-provider-search input[name="providerUid"][value="fia1-low"]',
    ).should('exist');
  });

  it('should find an existing idp, case insensitive, with space, with accent', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type(MINISTRY_NAME);

    cy.get(
      '#identity-provider-search input[name="providerUid"][value="fia1-low"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should find an existing idp, case insensitive, without space', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('mock - ministére de la');

    cy.get(
      '#identity-provider-search input[name="providerUid"][value="fia1-low"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should find an existing idp, case insensitive, without accent', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('mock - ministere de la');

    cy.get(
      '#identity-provider-search input[name="providerUid"][value="fia1-low"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should display an error message if no idp matches search', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('I do not exist');

    cy.get('#identity-provider-search input[name="providerUid"]').should(
      'not.exist',
    );

    cy.contains("Aucun fournisseur d'identité n'a été trouvé").should(
      'be.visible',
    );
  });

  it('should trigger error Y190007 if the CSRF token is not valid', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get('#fi-search-term').type(
      'MOCK - Ministére de la transition écologique - ALL FIS - SORT 2',
    );
    cy.get(`#fca-search-idp-${idpId}1-low > input[name="csrfToken"]`)
      // Reset CSRF form value
      .invoke('attr', 'value', 'INVALID-CSRF-VALUE');
    // When
    cy.get(`#idp-${idpId}1-low-button`).click();
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y190007');
  });

  it('should redirect when click on enabled IdP', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get('#fi-search-term').type(
      'MOCK - Ministére de la transition écologique - ALL FIS - SORT 2',
    );
    cy.get(
      '#identity-provider-search input[name="providerUid"][value="fia1-low"]',
    )
      .first()
      .next()
      .click();
    cy.url().should(
      'contain',
      getIdentityProvider('fia1-low').IDP_INTERACTION_URL,
    );
  });

  // TODO -> find how to update ministry
  describe('No app restart needed', () => {
    const spId = `${Cypress.env('SP_NAME')}1-low`;

    beforeEach(() => {
      cy.resetdb();
    });

    it('should update an identity provider properties, activate it, without an app restart needed', () => {
      const { SP_ROOT_URL } = getServiceProvider(spId);
      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();
      cy.get('#fi-search-term').type(MINISTRY_NAME);
      cy.get('#identity-provider-search').should(
        'not.contain',
        'Idp test Updated, activated',
      );

      cy.e2e('fca_idp_insert');
      cy.e2e('fca_idp_update_activate');
      cy.wait(500);
      cy.reload();
      cy.get('#fi-search-term').type('ministere');
      cy.get('#identity-provider-search').contains(
        'Idp test Updated, activated',
      );
    });

    it('should remove an identity provider without an app restart needed', () => {
      const { SP_ROOT_URL } = getServiceProvider(spId);
      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();
      cy.get('#fi-search-term').type(MINISTRY_NAME);
      cy.get('#identity-provider-search').should(
        'not.contain',
        'Idp test Inserted',
      );

      cy.e2e('fca_idp_insert');
      cy.wait(500);
      cy.reload();

      cy.e2e('fca_idp_remove');
      cy.wait(500);
      cy.reload();

      cy.get('#fi-search-term').type(MINISTRY_NAME);
      cy.get('#identity-provider-search').should(
        'not.contain',
        'Idp test Inserted',
      );
    });
  });
});
