import {
  basicErrorScenario,
  setFSAuthorizeAcr,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('9.9 - Interaction steps discarding', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  /**
   * @TODO #252
   * ETQ Dev, je vérifie la pertinence des tests cypress
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/252
   */
  it.skip('should trigger error Y150003 when going straigth to /login without a session', () => {
    const interactionId = 'foobar';
    cy.visit(
      `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction/${interactionId}/login`,
      { failOnStatusCode: false },
    );
    cy.hasError('Y150003');
  });

  /**
   * @TODO #252
   * ETQ Dev, je vérifie la pertinence des tests cypress
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/252
   */
  it.skip('should trigger error Y000004 when going to /login with a session', () => {
    const SP_URL = Cypress.env('SP1_ROOT_URL');

    cy.visit(SP_URL);
    setFSAuthorizeAcr('eidas2');
    submitFSAuthorizeForm();

    cy.url().should(
      'include',
      `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction`,
    );

    cy.getCookie('fc_interaction_id').then((cookie) => {
      const interactionId = cookie.value.match(/s%3A([^.]+)/).pop();
      cy.visit(
        `${Cypress.env(
          'FC_ROOT_URL',
        )}/api/v2/interaction/${interactionId}/login`,
        { failOnStatusCode: false },
      );
      cy.hasError('Y000004');
    });
  });

  it('should trigger error Y190006 when csrf token not matching with csrfToken in session', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'test',
      idpId,
    });

    cy.get('input[name="_csrf"]').then((csrf) => {
      csrf[0].value = 'obviouslyBadCSRF';
    });

    cy.get('#consent').click();

    cy.url().should('match', new RegExp(`\/login`));
    cy.hasError('Y190006');
  });

  it('should trigger error Y190006 when csrf token is empty', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'test',
      idpId,
    });

    cy.get('input[name="_csrf"]').then((csrf) => {
      csrf[0].value = '';
    });

    cy.get('#consent').click();

    cy.url().should('match', new RegExp(`\/login`));
    cy.hasError('Y190006');
  });

  it('should display "Not found" if we GET on /consent', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'test',
      idpId,
    });

    cy.getCookie('fc_session_id').then((cookie) => {
      const interactionId = cookie.value.match(/s%3A([^.]+)/).pop();
      cy.request({
        url: `${Cypress.env('FC_INTERACTION_URL')}/${interactionId}/login`,
        method: 'GET',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.statusText).to.eq('Not Found');
      });
    });
  });

  it('should trigger error Y000400 when csrf token is not present', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'test',
      idpId,
    });

    cy.get('input[name="_csrf"]').then((csrf) => {
      csrf[0].remove();
    });

    cy.get('#consent').click();

    cy.url().should('match', new RegExp(`\/login`));
    cy.hasError('Y000400');
  });
});
