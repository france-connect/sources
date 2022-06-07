import { UserCredentials } from '../types';

export default class LoginPage {
  login(userCredentials: UserCredentials): void {
    const { email, password } = userCredentials;

    cy.get('[name="email"]').clear().type(email);
    cy.get('[name="password"]').clear().type(password, { log: false });
    cy.get('[type="submit"]').click();
  }
}
