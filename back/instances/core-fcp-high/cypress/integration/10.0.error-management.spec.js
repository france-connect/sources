import {
  basicScenario,
  getAuthorizeUrl,
  getIdentityProvider,
} from './mire.utils';

describe('10.0 - Error Management', () => {
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;
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

    cy.get('.previous-link').should('not.exist');
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

    cy.get('.previous-link').should('not.exist');
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
    cy.get('#error-message').contains(
      `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
    );

    cy.get('.previous-link').should('exist');
    cy.get('.previous-link').contains('Revenir sur FSP - FSP1-HIGH');

    cy.get('.previous-link-container')
      .invoke('attr', 'href')
      .then(($link) => {
        cy.log($link);
      });
    cy.get('.previous-link').click();

    cy.url().should(
      'contains',
      '//fsp1-high.docker.dev-franceconnect.fr/error?error=Y000006',
    );
    cy.get('#error-title').contains(
      `Error: Y000006`,
    );
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
    cy.get(`#fs-request-${idpId}`).within(() => {
      cy.get('input[name="providerUid"]').invoke('attr', 'value', 'fip8-high');
      cy.get(`button#idp-${idpId}`).click();
    });

    cy.hasError('Y020023');
    cy.get('#error-message').contains(
      'Le fournisseur d\'identité que vous avez choisi n\'est pas autorisé pour effectuer votre démarche.',
    );

    cy.get('.previous-link').should('exist');
    cy.get('.previous-link').contains('Revenir sur FSP - FSP5-HIGH');

    cy.get('.previous-link').click();

    cy.url().should(
      'contains',
      '/error?error=Y020023&error_description=Le%20fournisseur%20d%27identit%C3%A9%20que%20vous%20avez%20choisi%20n%27est%20pas%20autoris%C3%A9%20pour%20effectuer%20votre%20d%C3%A9marche.&state=',
    );
  });

  it('should redirect to Sp if the session failed', () => {
    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
      userName: 'test',
    });

    cy.clearCookies();

    cy.get('#consent').click();

    cy.hasError('Y190001');
    cy.get('#error-message').contains(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous',
    );

    cy.get('.previous-link').should('not.exist');
  });

  it('shoudld redirect to the good sp if we are already a locals session defined', () => {
    // Initialize a session with sp1 information
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);


    // Generate error on authorize
    const url = getAuthorizeUrl({
      // Oidc convention name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'random-bad-client-id'
    })
    cy.visit(url, {
      failOnStatusCode: false,
    });
    cy.hasError('Y030106');

    cy.get('.previous-link').should('not.exist');
  })
});
