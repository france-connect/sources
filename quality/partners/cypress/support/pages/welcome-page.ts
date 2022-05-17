export default class WelcomePage {
  checkHelloWorld(message: string): void {
    cy.contains("#page-container", message);
  }
}
