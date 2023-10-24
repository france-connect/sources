import { getAuthorizeUrl, getServiceProvider } from './mire.utils';

describe('7.1 Idp whitelist & blacklist', () => {
  const mireUrl = new RegExp('/interaction/[^/]+');
  // -- replace by either `fip` or `fia`
  const { SP_ROOT_URL, SP_CLIENT_ID } = getServiceProvider(
    `${Cypress.env('SP_NAME')}2-low`,
  );

  it('should display only whitelist idps', () => {
    cy.visit(
      getAuthorizeUrl({
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${SP_CLIENT_ID}`,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${SP_ROOT_URL}/oidc-callback`,
      }),
    );
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('ministere');

    cy.get(
      '#identity-provider-result input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]',
    ).should('exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="0e7c099f-fe86-49a0-b7d1-19df45397212"]',
    ).should('exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="405d3839-9182-415f-9926-597489d11509"]',
    ).should('not.exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="87762a76-7da0-442d-8243-5785f859b88b"]',
    ).should('not.exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="46f5d9f9-881d-46b1-bdcc-0548913ea443"]',
    ).should('exist');
  });

  it('should not display blacklist idps', () => {
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);

    cy.get('#fi-search-term').type('ministere');

    cy.get(
      '#identity-provider-result input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]',
    ).should('exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="0e7c099f-fe86-49a0-b7d1-19df45397212"]',
    ).should('exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="405d3839-9182-415f-9926-597489d11509"]',
    ).should('not.exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="87762a76-7da0-442d-8243-5785f859b88b"]',
    ).should('exist');
    cy.get(
      '#identity-provider-result input[name="providerUid"][value="46f5d9f9-881d-46b1-bdcc-0548913ea443"]',
    ).should('not.exist');
  });

  it('should trigger error 020023 when forging click on existing IdP in blacklist', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get('#fi-search-term').type('ministere');
    cy.get(
      `input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]`,
    ).invoke('attr', 'value', '46f5d9f9-881d-46b1-bdcc-0548913ea443');
    cy.get('#idp-9c716f61-b8a1-435c-a407-ef4d677ec270-button').click();
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020023');
  });

  it('should trigger error 020023 when forging click on non existing IdP in whitelist', () => {
    // Given
    cy.visit(
      getAuthorizeUrl({
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${SP_CLIENT_ID}`,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${SP_ROOT_URL}/oidc-callback`,
      }),
    );
    cy.url().should('match', mireUrl);
    // When
    cy.get('#fi-search-term').type('ministere');
    cy.get(
      `input[name="providerUid"][value="9c716f61-b8a1-435c-a407-ef4d677ec270"]`,
    ).invoke('attr', 'value', '87762a76-7da0-442d-8243-5785f859b88bs');
    cy.get('#idp-9c716f61-b8a1-435c-a407-ef4d677ec270-button').click();

    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020023');
  });
});
