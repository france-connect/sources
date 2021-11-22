export function login(username, password) {
  cy.formFill({ username, password }, {totp : true, fast: true });
  cy.get('button[type="submit"]').click();
}

export function logout(name) {
  cy.get('.dropdown-toggle')
    .contains(name)
    .click();
  cy.contains('Déconnexion').click();
}
