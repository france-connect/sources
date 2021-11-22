import { getAuthorizeUrl } from './mire.utils';

describe('9.0 - Service Provider', () => {
  it('should trigger error Y030106 if SP is not in database', () => {
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'random-bad-client-id',
    });
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.hasError('Y030106');
  });

  it('should trigger error Y030106 if SP is in database but disabled', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'my-service-provider-deactivated',
    });
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.hasError('Y030106');
  });

  it('should return to SP1 with an error "invalid_scope" if the requested scope contains unhautorized scopes for this FS', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'my-service-provider-only-openid-birthdate-scopes',
    });

    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.url()
      .should('contains', `${Cypress.env(`SP1_ROOT_URL`)}/error?`)
      .should('contains', 'error=invalid_scope')
      .should(
        'contains',
        'error_description=requested%20scope%20is%20not%20allowed',
      )
      .should('contains', 'scope=gender')
      .should('contains', 'state=stateTraces');
  });

  it('should trigger error Y030118 if the parameter redirect_uri does NOT match one of the redirect uris of the SP in database', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uri: 'https://my-malicious-url.fr/callback',
    });
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.hasError('Y030118');
  });
});
