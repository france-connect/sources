export default class SPListPage {
  checkIsVisible(): void {
    cy.contains('h1', 'Fournisseurs de service')
  }
}
