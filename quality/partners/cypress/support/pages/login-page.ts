import { UserCredentials } from '../types';

export default class LoginPage {
  login(userCredentials: UserCredentials): void {
    const { email, password } = userCredentials;

    cy.get('[name="email"]').clear();
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').clear();
    cy.get('[name="password"]').type(password, { log: false });
    cy.get('[type="submit"]').click();
  }
}
