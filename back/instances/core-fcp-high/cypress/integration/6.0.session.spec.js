import {
  basicScenario,
  getAuthorizeUrl,
  getIdentityProvider,
} from './mire.utils';

describe('6.0 - Session', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  it('should trigger error Y190001 (no session found)', () => {
    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
      userName: 'test',
    });

    cy.clearCookies();

    cy.get('#consent').click();

    cy.url().should('match', new RegExp(`\/login`));
    cy.hasError('Y190001');
  });

  it('should trigger error Y190001 if FC session cookie not set', () => {
    const authorizeUrl = getAuthorizeUrl();
    cy.visit(authorizeUrl);
    cy.url().should('match', new RegExp(`\/interaction\/[^/]+$`));

    cy.url().then((interactionUrl) => {
      cy.clearCookie('fc_session_id');
      cy.visit(interactionUrl, { failOnStatusCode: false });
      cy.url().should('match', new RegExp(`\/interaction\/[^/]+$`));
      cy.hasError('Y190001');
    });
  });

  it('should trigger error Y190001 if FC session cookie does not match found backend interaction', () => {
    const authorizeUrl = getAuthorizeUrl();
    cy.visit(authorizeUrl);
    cy.url().should('match', new RegExp(`\/interaction\/[^/]+$`));

    cy.url().then((interactionUrl) => {
      /**
       * Forged cookie
       * We override cookie while keeping signature...
       *
       * We have to get existing cookie and edit its value,
       * otherwise it is not reconnized as a signed cookie
       * and we get an error Y150004 which is not what we want to test here.
       */
      cy.getCookie('fc_session_id').then((cookie) => {
        cy.setCookie(
          'fc_session_id',
          // Replace the begining of the cookie by arbitratry value
          cookie.value.replace(/^s%3A(.){4}/, 's%3Arofl'),
          {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            domain: Cypress.env('APP_DOMAIN'),
          },
        );
        cy.visit(interactionUrl, { failOnStatusCode: false });
        cy.url().should('match', new RegExp(`\/interaction\/[^/]+$`));
        cy.hasError('Y190001');
      });
    });
  });

  it('should have two cookies stored for SP with the property `sameSite` value set to `lax`', () => {
    cy.clearCookie('sp_session_id');
    cy.clearCookie('sp_interaction_id');
    cy.visit(Cypress.env('SP1_ROOT_URL'));
    cy.getCookies()
      .should('have.length', 2)
      .then((cookies) => {
        expect(cookies[1]).to.have.property('sameSite', 'lax');
      });
  });

  it('should have cookie stored for IdP with the property `sameSite` value set to `lax`', () => {
    cy.clearCookies();

    const idpInfo = getIdentityProvider(idpId);

    basicScenario({
      idpId,
      // Oidc naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      userName: 'test',
    });

    cy.request({
      url: `${idpInfo.IDP_ROOT_URL}`,
      method: 'GET',
    })
      .then(() => {
        cy.getCookie('fc_session_id').then((cookie) => {
          expect(cookie).to.have.property('sameSite', 'lax');
        });
      });
  });
});
