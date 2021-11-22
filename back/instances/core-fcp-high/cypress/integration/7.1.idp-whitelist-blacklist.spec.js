import { getAuthorizeUrl } from './mire.utils';

describe('7.1 - Idp whitelist & blacklist', () => {
  before(() => {
    cy.resetdb();
  });

  // -- replace by either `fip` or `fia`
  const idpId = `${Cypress.env('IDP_NAME')}`;

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should trigger error 020023 when forging click on non existing IdP in whitelist', () => {
    // Given
    cy.visit(
      getAuthorizeUrl({ 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${Cypress.env('SP5_CLIENT_ID')}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${Cypress.env('SP5_ROOT_URL')}/oidc-callback`,
      })
    );
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#fs-request-${idpId}1-high`).within(() => {
      cy.get('input[name="providerUid"]').invoke('attr', 'value', 'fip8-high');
      cy.get(`button#idp-${idpId}1-high`).click();
    });
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020023');
  });

  it('should trigger error 020023 when forging click on IdP in blacklist', () => {
    // Given
    cy.visit(
      getAuthorizeUrl({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${Cypress.env('SP2_CLIENT_ID')}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${Cypress.env('SP2_ROOT_URL')}/oidc-callback`,
      }),
    );
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#fs-request-${idpId}1-high`).within(() => {
      cy.get('input[name="providerUid"]').invoke('attr', 'value', 'fip8-high');
      cy.get(`button#idp-${idpId}1-high`).click();
    });
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020023');
  });

  it('should display only whitelisted idps', () => {
    cy.visit(
      getAuthorizeUrl({ 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${Cypress.env('SP5_CLIENT_ID')}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${Cypress.env('SP5_ROOT_URL')}/oidc-callback`,
      })
    );
    cy.url().should('match', mireUrl);
    // Then
    cy.get('#idp-list').within(() => {
      // Enabled idps
      cy.get(`button#idp-${idpId}1-high`).should('not.be.disabled');
      cy.get(`button#idp-${idpId}2-high`).should('not.be.disabled');
      cy.get(`button#idp-${idpId}6-high`).should('not.be.disabled');
      // Disabled idps
      cy.get(`button#idp-${idpId}3-desactive-visible`).should('be.disabled');
      // Not visible because not in whitelist
      cy.get(`button#idp-${idpId}8-high`).should('not.exist');
    });
  });

  it('should display non blacklisted idps', () => {
    cy.visit(
      getAuthorizeUrl({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${Cypress.env('SP2_CLIENT_ID')}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${Cypress.env('SP2_ROOT_URL')}/oidc-callback`,
      })
    );
    cy.url().should('match', mireUrl);
    // Then
    cy.get('#idp-list').within(() => {
      // Enabled idps
      cy.get(`button#idp-${idpId}1-high`).should('not.be.disabled');
      cy.get(`button#idp-${idpId}2-high`).should('not.be.disabled');
      cy.get(`button#idp-${idpId}6-high`).should('not.be.disabled');
      // Disabled idps
      cy.get(`button#idp-${idpId}3-desactive-visible`).should('be.disabled');
      // Not visible because in blacklist
      cy.get(`button#idp-${idpId}8-high`).should('not.exist');
    });
  });
});
