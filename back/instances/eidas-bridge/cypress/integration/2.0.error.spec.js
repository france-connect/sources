import { basicFailureScenarioFrSpEuIdp } from './mire.utils';

describe('Error scenarios (EU Citizen / FR Service Provider)', () => {
  it('should cancel the authentication at eIDAS mandatory requested attributes consent and return to FC+ oidc callback with an oidc error', () => {
    basicFailureScenarioFrSpEuIdp({ cancel: 'mandatory_attributes' });
    cy.url().should(
      'includes',
      `${Cypress.env(
        'CORE_ROOT_URL',
      )}/api/v2/oidc-callback?error=eidas_node_error&error_description=StatusCode%3A%20Responder%0ASubStatusCode%3A%20RequestDenied%0AStatusMessage%3A%20Consent%20not%20given%20for%20a%20mandatory%20attribute.&state=`,
    );
  });

  it('should cancel the authentication at eIDAS optional requested attributes consent and return to FC+ oidc callback with an oidc error', () => {
    basicFailureScenarioFrSpEuIdp({ cancel: 'optional_attributes' });
    cy.url().should(
      'includes',
      `${Cypress.env(
        'CORE_ROOT_URL',
      )}/api/v2/oidc-callback?error=eidas_node_error&error_description=StatusCode%3A%20Responder%0ASubStatusCode%3A%20RequestDenied%0AStatusMessage%3A%20Consent%20not%20given%20for%20a%20mandatory%20attribute.&state=`,
    );
  });

  it('should cancel the authentication at eIDAS provided attributes confirmation and return to FC+ oidc callback with an oidc error', () => {
    basicFailureScenarioFrSpEuIdp({ cancel: 'confirmation' });
    cy.url().should(
      'includes',
      `${Cypress.env(
        'CORE_ROOT_URL',
      )}/api/v2/oidc-callback?error=eidas_node_error&error_description=StatusCode%3A%20Responder%0ASubStatusCode%3A%20RequestDenied%0AStatusMessage%3A%20Citizen%20consent%20not%20given.&state=`,
    );
  });

  it('should return to FC+ oidc callback with an oidc error as the loa is lower than accepted', () => {
    basicFailureScenarioFrSpEuIdp({ loa: 'A' });
    cy.url().should(
      'includes',
      `${Cypress.env(
        'CORE_ROOT_URL',
      )}/api/v2/oidc-callback?error=eidas_node_error&error_description=StatusCode%3A%20Responder%0ASubStatusCode%3A%20%23%23%0AStatusMessage%3A%20202019%20-%20Incorrect%20Level%20of%20Assurance%20in%20IdP%20response&state=`,
    );
  });
});
