import { getAuthorizeUrl } from './mire.utils';

describe('8.0.2 - Response type', () => {
  it('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (id_token)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'id_token',
    });

    cy.request({ url, followRedirect: false }).then((resp) => {
      expect(resp.status).to.eq(303);
      expect(resp.redirectedToUrl).to.equals(
        `${Cypress.env(
          'SP1_ROOT_URL',
        )}/oidc-callback#error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=stateTraces`,
      );
    });
  });

  it('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (id_token token)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'id_token token',
    });

    cy.request({ url, followRedirect: false }).then((resp) => {
      expect(resp.status).to.eq(303);
      expect(resp.redirectedToUrl).to.equals(
        `${Cypress.env(
          'SP1_ROOT_URL',
        )}/oidc-callback#error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=stateTraces`,
      );
    });
  });

  it('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (code id_token)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'code id_token',
    });

    cy.request({ url, followRedirect: false }).then((resp) => {
      expect(resp.status).to.eq(303);
      expect(resp.redirectedToUrl).to.equals(
        `${Cypress.env(
          'SP1_ROOT_URL',
        )}/oidc-callback#error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=stateTraces`,
      );
    });
  });

  it('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (code token)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'code token',
    });

    cy.request({ url, followRedirect: false }).then((resp) => {
      expect(resp.status).to.eq(303);
      expect(resp.redirectedToUrl).to.equals(
        `${Cypress.env(
          'SP1_ROOT_URL',
        )}/oidc-callback#error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=stateTraces`,
      );
    });
  });

  it('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (code id_token token)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'code id_token token',
    });

    cy.request({ url, followRedirect: false }).then((resp) => {
      expect(resp.status).to.eq(303);
      expect(resp.redirectedToUrl).to.equals(
        `${Cypress.env(
          'SP1_ROOT_URL',
        )}/oidc-callback#error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=stateTraces`,
      );
    });
  });

  /**
   * @TODO #197 Implement tests once feature is implemented in `oidc-client`
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/197
   */
  it.skip('should return to the SP with an "unsupported_response_type" error if the query contains a non registered "response_type" (what the fuck)', () => {
    const url = getAuthorizeUrl({
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'what the fuck',
    });

    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.url().should('match', new RegExp('.*'));

    cy.get('#error-title').contains('unsupported_response_type');
    cy.get('#error-description').contains(
      'unsupported response_type requested',
    );
  });
});
