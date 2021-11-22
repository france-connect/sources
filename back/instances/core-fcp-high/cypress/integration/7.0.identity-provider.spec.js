import {
  getAuthorizeUrl,
  setFSAuthorizeAcr,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('7.0 - Idp activation & visibility', () => {
  before(() => {
    cy.resetdb();
  });

  // -- replace by either `fip` or `fia`
  const idpId = `${Cypress.env('IDP_NAME')}`;

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should display the right title either for activated or disabled IdPs', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get('#idp-list').within(() => {
      // Control that title is set
      cy.get(`#idp-${idpId}1-high-title`).should('exist');
      cy.get(`#idp-${idpId}3-desactive-visible-title`).should('exist');
      // Control that the right text is set
      cy.get(`#idp-${idpId}1-high-title`).contains(
        'J’utilise l’application IDP1 - Identity Provider - eIDAS élevé - nodiscov - crypt',
      );
      cy.get(`#idp-${idpId}3-desactive-visible-title`).contains(
        'FI désactivé mais visible est actuellement indisponible',
      );
    });
  });

  it('should redirect when click on enabled IdP with discovery', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#idp-list button#idp-${idpId}8-high`).click();
    // Then
    cy.url().should('match', new RegExp(`^https://${idpId}1-high.+$`));
  });

  it('should not display an enabled IdP with discovery url but no discovery parameter', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(`#idp-list button#idp-${idpId}7-high`).should('not.exist');
  });

  it('should not display an enabled IdP with discovery but no discovery url', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(`#idp-list button#idp-${idpId}9-high`).should('not.exist');
  });

  it('should not display an enabled IdP with discovery and forbidden parameters', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(`#idp-list button#idp-${idpId}10-high`).should('not.exist');
  });

  it('should redirect when click on enabled IdP with jwksUrl and right config', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#idp-list button#idp-${idpId}11-high`).click();
    // Then
    cy.url().should('match', new RegExp(`^https://${idpId}1-high.+$`));
  });

  it('should not display an enabled IdP with jwksUrl and wrong config', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(`#idp-list button#idp-${idpId}12-high`).should('not.exist');
  });

  it('should not display an enabled IdP without discovery and missing parameters', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(`#idp-list button#idp-${idpId}13bis-high`).should('not.exist');
  });

  it('should trigger error 020017 when forging click on disabled IdP', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#idp-list button#idp-${idpId}3-desactive-visible`)
      // Remove the disabled attribute
      .invoke('attr', 'disabled', false)
      .click();
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');

    cy.hasError('Y020017');
  });

  it('should trigger error 020019 when forging click on non existing IdP', () => {
    // Given
    cy.visit(
      getAuthorizeUrl({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: `${Cypress.env('SP2_CLIENT_ID')}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${Cypress.env('SP2_ROOT_URL')}/oidc-callback`,
      }),
    );
    cy.url().should('match', mireUrl);
    // When
    cy.get(`#fs-request-${idpId}1-high`).within(() => {
      cy.get('input[name="providerUid"]').invoke(
        'attr',
        'value',
        'random-non-exisitig-IdP',
      );
      cy.get(`button#idp-${idpId}1-high`).click();
    });
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020019');
  });

  it('should trigger error Y190007 if the CSRF token is not valid', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get(`#fs-request-${idpId}1-high > input[name="csrfToken"]`)
      // Reset CSRF form value
      .invoke('attr', 'value', 'INVALID-CSRF-VALUE');
    // When
    cy.get(`#idp-list button#idp-${idpId}1-high`).click();
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y190007');
  });

  describe('No app restart needed', () => {
    beforeEach(() => {
      cy.resetdb();
    });

    it('should display an identity provider that has been added without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('#idp-list').contains('Idp test Inserted').should('not.exist');

      cy.e2e('idp_insert');
      cy.wait(500);
      cy.reload();

      cy.get('#idp-list').contains('Idp test Inserted');
    });

    it('should update an identity provider properties, activate it, without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('#idp-list').contains('Idp test Inserted').should('not.exist');

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();

      cy.get('#idp-list').contains('Idp test Updated, activated');
    });

    it('should update an identity provider properties, deactivate it, without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('#idp-list').contains('idp-test-update').should('not.exist');

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();
      cy.get('#idp-list')
        .contains('Idp test Updated, activated')
        .should('exist');

      cy.e2e('idp_update_desactivate');
      cy.wait(500);
      cy.reload();
      cy.get('#idp-list').contains(
        'Idp test Updated, desactivated est actuellement indisponible',
      );
    });

    it('should remove an identity provider without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('#idp-list').contains('idp-test-update').should('not.exist');

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();
      cy.get('#idp-list')
        .contains('Idp test Updated, activated')
        .should('exist');

      cy.e2e('idp_remove');
      cy.wait(500);
      cy.reload();
      cy.get('#idp-list')
        .contains('Idp test Updated, activated')
        .should('not.exist');
    });
  });
});
