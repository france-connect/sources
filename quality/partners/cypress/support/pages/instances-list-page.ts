import { ChainableElement } from '../types';
import InstanceCard from './instance-card';

export default class InstancesListPage {
  getConfirmationMessageTitle(): ChainableElement {
    return cy.get('[data-testid="instances-page-alert-top-title"]');
  }

  getConfirmationMessageCloseButton(): ChainableElement {
    return cy.get('[data-testid="instances-page-alert-top-close-button"]');
  }

  getCreateInstanceTile(): ChainableElement {
    return cy.contains(
      '[data-testid="instances-page-create-tile-title"] a',
      'Créer une instance de test',
    );
  }

  getAddInstanceLink(): ChainableElement {
    return cy.get('[data-testid="CreateInstanceButton"]');
  }

  getAllInstanceCards(): ChainableElement {
    return cy.get('[data-testid="CardComponent"]');
  }

  // Index starting with 0
  getInstanceCard(index: number): InstanceCard {
    return new InstanceCard(index);
  }

  checkIsVisible(): void {
    cy.contains(
      '[data-testid="instances-page-title"]',
      'Mon instance de test',
    ).should('be.visible');
  }

  checkIsInstanceCreationConfirmationVisible(isVisible: boolean): void {
    if (isVisible) {
      this.getConfirmationMessageTitle()
        .should('be.visible')
        .should('have.text', 'Votre instance de test a été créée.');
    } else {
      this.getConfirmationMessageTitle().should('not.exist');
    }
  }

  checkIsInstanceUpdateConfirmationVisible(isVisible: boolean): void {
    if (isVisible) {
      this.getConfirmationMessageTitle()
        .should('be.visible')
        .should('have.text', 'Votre instance de test a été mise à jour.');
    } else {
      this.getConfirmationMessageTitle().should('not.exist');
    }
  }

  hideConfirmationMessage(): void {
    this.getConfirmationMessageCloseButton().click();
  }

  findInstanceCard(
    instanceName: string,
    eventIndex = 1,
  ): Cypress.Chainable<InstanceCard | null> {
    let cardIndex;
    return this.getAllInstanceCards()
      .each(($el, index) => {
        // @TODO Matthieu
        const instanceNameActual = $el
          .find('[data-testid="CardComponent-title"] a')
          .text();
        if (instanceNameActual === instanceName) {
          if (eventIndex === 1) {
            cardIndex = index;
            return false;
          }
          eventIndex = eventIndex - 1;
        }
      })
      .then(() => {
        if (cardIndex !== undefined) {
          return this.getInstanceCard(cardIndex);
        } else {
          return null;
        }
      });
  }
}
