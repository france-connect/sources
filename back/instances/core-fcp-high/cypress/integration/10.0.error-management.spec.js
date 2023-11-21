import {
  basicScenario,
  getAuthorizeUrl,
  getIdentityProvider,
} from './mire.utils';

describe('10.0 - Error Management', () => {
  const idpId = 'dedc7160-8811-4d0f-9dd7-c072c15f2f18';
  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should not have link to error management after wrong client_id in authorize', () => {
    const url = getAuthorizeUrl({
      // oidc naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'WrongClientID',
    });
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.get('[data-testid="back-to-sp-link"]').should('not.exist');
  });

  it('should not have link to error management after redirect_uri in authorize', () => {
    const url = getAuthorizeUrl({
      // oidc naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uri: 'WrongRedirect_uri',
    });
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.get('[data-testid="back-to-sp-link"]').should('not.exist');
  });

  it('should redirect to Sp after Idp crashed', () => {
    const idpInfo = getIdentityProvider(idpId);
    cy.registerProxyURL(`${idpInfo.IDP_ROOT_URL}/authorize?*`, {
      scope: 'openid first_name',
    });

    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
    });

    cy.proxyURLWasActivated();

    cy.hasError('Y000006');
    cy.hasErrorMessage(
      `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
    );

    cy.get('[data-testid="back-to-sp-link"]').should('exist');
    cy.get('[data-testid="back-to-sp-link"]').contains(
      'Revenir sur FSP - FSP1-HIGH',
    );

    cy.get('[data-testid="back-to-sp-link"]')
      .invoke('attr', 'href')
      .then(($link) => {
        cy.log($link);
      });
    cy.get('[data-testid="back-to-sp-link"]').click();

    cy.url().should(
      'contains',
      '//fsp1-high.docker.dev-franceconnect.fr/error?error=Y000006',
    );
    cy.get('#error-title').contains(`Error: Y000006`);
    cy.get('#error-description').contains(
      `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
    );
  });

  it('should redirect to Sp if we select an blacklisted Idp', () => {
    const url = getAuthorizeUrl({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: `${Cypress.env('SP5_CLIENT_ID')}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uri: `${Cypress.env('SP5_ROOT_URL')}/oidc-callback`,
    });
    cy.visit(url);

    /**
     * intentionally blacklisted to create a false error
     */
    cy.get(`[data-testid="fs-request-${idpId}"]`).within(() => {
      cy.get('input[name="providerUid"]').invoke('attr', 'value', 'fip8-high');
      cy.get(`button#idp-${idpId}`).click();
    });

    cy.hasError('Y020023');
    cy.hasErrorMessage(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );

    cy.get('[data-testid="back-to-sp-link"]').should('exist');
    cy.get('[data-testid="back-to-sp-link"]').contains(
      'Revenir sur FSP - FSP5-HIGH',
    );

    cy.get('[data-testid="back-to-sp-link"]').click();

    cy.url().should(
      'contains',
      'error?error=Y020023&error_description=Une%20erreur%20technique%20est%20survenue%2C%20fermez%20l%E2%80%99onglet%20de%20votre%20navigateur%20et%20reconnectez-vous.&state=stateTraces',
    );
  });
});
