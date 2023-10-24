import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  getAuthorizeUrl,
  getServiceProvider,
} from './mire.utils';

describe('Session', () => {
  const idpId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

  /**
   * @TODO #306 Backport this test from core-fcp :
   * We can't reproduce easily the clearCookie only once back from idp
   * since there is no more consent page.
   *
   * We could duplicate `basicScenario`
   * but we would still have to be able to act between HTTP redirections
   *
   * Maybe we can find another way to create this test
   * (clear only core-fca cookies ?)
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/306
   */
  it.skip('should trigger error Y190001 (session not found)', () => {
    basicErrorScenario({
      errorCode: 'test',
      idpId,
    });

    cy.clearCookies();

    cy.url().should('match', new RegExp(`\/interaction\/[^/]+\/login`));
    cy.hasError('Y190001');
  });

  it('should trigger error Y190001 if FC session cookie not set', () => {
    const authorizeUrl = getAuthorizeUrl();
    cy.visit(authorizeUrl);

    cy.get('#fi-search-term').should('be.visible');
    cy.url().should('match', new RegExp(`\/interaction\/[^/]+$`));

    cy.url().then((interactionUrl) => {
      cy.clearCookie('fc_session_id');
      cy.visit(interactionUrl, { failOnStatusCode: false });
      cy.hasError('Y190001');
      cy.url().should('match', new RegExp(`\/api\/v2\/error$`));
    });
  });

  it('should have two cookies stored for SP with the property `sameSite` value set to `lax`', () => {
    const { SP_ROOT_URL } = getServiceProvider(
      `${Cypress.env('SP_NAME')}1-low`,
    );
    cy.visit(SP_ROOT_URL);
    cy.getCookies()
      .should('have.length', 2)
      .then((cookies) => {
        expect(cookies[1]).to.have.property('sameSite', 'lax');
      });
  });

  it('should have cookie stored for IdP with the property `sameSite` value set to `lax`', () => {
    const loginInfo = {
      acrValues: 'eidas1',
      userName: 'test',
      password: '123',
      idpId,
    };

    beforeSuccessScenario(loginInfo);
    basicSuccessScenario(loginInfo.idpId);
    afterSuccessScenario(loginInfo);

    cy.getCookie('fc_session_id').then((cookie) => {
      expect(cookie).to.have.property('sameSite', 'lax');
    });
  });
});
