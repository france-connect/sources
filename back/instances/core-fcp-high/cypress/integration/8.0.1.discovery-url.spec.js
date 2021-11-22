describe('8.0.1 - Discovery Url', () => {

  describe('discovery endpoint', () => {
    it('should not have "offline_access" in supported scopes', () => {
      cy.request(`${Cypress.env('FC_ROOT_URL')}${Cypress.env('WELL_KNOWN')}`)
        .its('body')
        .then((body) => body.scopes_supported)
        .should('not.include', 'offline_access')
        .should('include', 'openid')
        .should('include', 'given_name')
        .should('include', 'family_name')
        .should('include', 'birthdate')
        .should('include', 'gender')
        .should('include', 'birthplace')
        .should('include', 'birthcountry')
        .should('include', 'email')
        .should('include', 'preferred_username')
        .should('include', 'profile')
        .should('include', 'birth')
        .should('include', 'identite_pivot');
    });
  });

});
