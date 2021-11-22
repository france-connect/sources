import { getAuthorizeUrl } from './mire.utils';

describe('prompt', () => {
  it('should not allow prompt=none', () => {
    const url = getAuthorizeUrl({ prompt: 'none' });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should not allow prompt=select_account', () => {
    const url = getAuthorizeUrl({ prompt: 'select_account' });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should allow prompt=login', () => {
    const url = getAuthorizeUrl({ prompt: 'login' });
    cy.visit(url, { failOnStatusCode: false });
    cy.get('#fi-search-term').should('exist');
  });

  it('should allow prompt=consent', () => {
    const url = getAuthorizeUrl({ prompt: 'consent' });
    cy.visit(url, { failOnStatusCode: false });
    cy.get('#fi-search-term').should('exist');
  });

  it('should allow prompt=login consent', () => {
    const url = getAuthorizeUrl({ prompt: 'login consent' });
    cy.visit(url, { failOnStatusCode: false });
    cy.get('#fi-search-term').should('exist');
  });

  it('should allow prompt=consent login', () => {
    const url = getAuthorizeUrl({ prompt: 'consent login' });
    cy.visit(url, { failOnStatusCode: false });
    cy.get('#fi-search-term').should('exist');
  });
});
