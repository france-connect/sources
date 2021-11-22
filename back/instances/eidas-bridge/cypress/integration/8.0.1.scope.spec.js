describe('8.0.1 Scope', () => {
  describe('discovery endpoint', () => {
    it('should not have "offline_access" in supported scopes', () => {
      cy.request(`${Cypress.env('BRIDGE_ROOT_URL')}${Cypress.env('WELL_KNOWN')}`)
        .its('body')
        .then((body) => body.scopes_supported)
        .should('not.include', 'offline_access')
        .and('include', 'openid')
        .and('include', 'given_name')
        .and('include', 'family_name')
        .and('include', 'birthdate')
        .and('include', 'gender')
        .and('include', 'birthplace')
        .and('include', 'birthcountry')
        .and('include', 'email')
        .and('include', 'preferred_username')
        .and('include', 'profile');
    });
  });
});
