import {
  getAuthorizeUrl,
  getIdentityProvider,
  getServiceProvider,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('Idp activation & visibility', () => {
  const { IDP_INTERACTION_URL, MINISTRY_NAME, TITLE } = getIdentityProvider(
    `9c716f61-b8a1-435c-a407-ef4d677ec270`,
  );

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should find an existing idp, case insensitive, with space, with accent', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type(MINISTRY_NAME);

    cy.get(
      '#identity-provider-result input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should find an existing idp, case insensitive, without space', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('mock - ministère de la');

    cy.get(
      '#identity-provider-result input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should find an existing idp, case insensitive, without accent', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('mock - ministere de la');

    cy.get(
      '#identity-provider-result input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]',
    ).should('exist');

    cy.contains(TITLE).click();
    cy.url().should('include', IDP_INTERACTION_URL);
  });

  it('should display an error message if no idp matches search', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('I do not exist');

    cy.get('#identity-provider-result input[name="providerUid"]').should(
      'not.exist',
    );

    cy.contains('Nous ne trouvons pas votre administration').should(
      'be.visible',
    );

    cy.contains('Vous pouvez continuer en utilisant MonComptePro').should(
      'be.visible',
    );
  });

  it('should trigger error Y190007 if the CSRF token is not valid', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get('#fi-search-term').type(
      'MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
    );
    cy.get(
      `#fca-search-idp-9c716f61-b8a1-435c-a407-ef4d677ec270 > input[name="csrfToken"]`,
    )
      // Reset CSRF form value
      .invoke('attr', 'value', 'INVALID-CSRF-VALUE');
    // When
    cy.get(`#idp-9c716f61-b8a1-435c-a407-ef4d677ec270-button`).click();
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y190007');
  });

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
      cy.get('#identity-provider-result').should(
        'not.contain',
        'Idp test Updated, activated',
      );

      cy.e2e('fca_idp_insert');
      cy.e2e('fca_idp_update_activate');
      cy.wait(500);
      cy.reload();
      cy.get('#fi-search-term').type('ministere');
      cy.contains('#identity-provider-result', 'Idp test Updated, activated');
    });

    it('should remove an identity provider without an app restart needed', () => {
      const { SP_ROOT_URL } = getServiceProvider(spId);
      cy.visit(SP_ROOT_URL);
      submitFSAuthorizeForm();
      cy.get('#fi-search-term').type(MINISTRY_NAME);
      cy.get('#identity-provider-result').should(
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
      cy.get('#identity-provider-result').should(
        'not.contain',
        'Idp test Inserted',
      );
    });
  });
});
