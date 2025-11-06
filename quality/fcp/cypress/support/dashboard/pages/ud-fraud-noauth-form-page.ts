import { ChainableElement } from '../../common/types';
import UdFraudFormPage from './ud-fraud-form-page';

export default class UdFraudNoauthFormPage extends UdFraudFormPage {
  getPageTitle(): ChainableElement {
    return cy.get('h1');
  }

  getStepperState(): ChainableElement {
    return cy.get('.fr-stepper__state');
  }

  getStepperTitle(): ChainableElement {
    return cy.get('.fr-stepper__title');
  }

  getFormTitle(): ChainableElement {
    return cy.get('h2');
  }

  getVisibleInputFromName(name: string): ChainableElement {
    return cy.get(`form.dto2form [name=${name}]:not([type="hidden"])`);
  }

  checkIsStepVisible(stepName: string): void {
    const stepTitleMapping = {
      'connexions existantes': 'Connexion(s) correspondante(s)',
      contact: 'Contact',
      description: 'Description de l’usurpation',
      'identification de connexion': 'Code d’identification',
      'identitée usurpée': 'Identité usurpée',
      récapitulatif: 'Récapitulatif',
    };
    const stepTitle = stepTitleMapping[stepName];
    expect(stepTitle).to.be.ok;
    this.getStepperTitle().should('be.visible').should('contain', stepTitle);
  }

  getErrorMessageFromName(name: string): ChainableElement {
    return cy.get(`[data-testid="${name}-messages"]`);
  }

  getEnterNewCodeButton(): ChainableElement {
    return cy.get('[data-testid="enter-new-code-button"]');
  }

  getConnectionCards(): ChainableElement {
    return cy.get('[data-testid="TrackCardComponent"]');
  }

  getNoConnectionFoundAlert(): ChainableElement {
    return cy.contains(
      '.fr-message--error',
      'Aucune connexion ne correspond au code renseigné.',
    );
  }

  getValidateConnectionsButton(): ChainableElement {
    return cy.get('[data-testid="validate-connections-button"]');
  }

  getConsentCheckbox(): ChainableElement {
    return cy.get('[name="consent"]');
  }

  getIdentificationCodeAccordion(): ChainableElement {
    return cy.get('[data-testid="AccordionComponent-title"]');
  }

  getIdentificationCodeAccordionContent(): ChainableElement {
    return cy.get('[data-testid="AccordionComponent-content"]');
  }
}
