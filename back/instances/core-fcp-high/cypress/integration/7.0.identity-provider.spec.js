import {
  getAuthorizeUrl,
  setFSAuthorizeAcr,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('7.0 - Idp activation & visibility', () => {
  before(() => {
    cy.resetdb();
  });

  const mireUrl = new RegExp('/interaction/[^/]+');

  it('should display the right title either for activated or disabled IdPs', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get('[data-testid="main-providers"]').within(() => {
      // Control image.alt content is set if provider has a logo
      cy.get('[data-testid="idp-dedc7160-8811-4d0f-9dd7-c072c15f2f18"]').should(
        'exist',
      );
      cy.get('[data-testid="idp-dedc7160-8811-4d0f-9dd7-c072c15f2f18"] img')
        .invoke('attr', 'alt')
        .should(
          'eq',
          'IDP1 - Identity Provider - eIDAS élevé - discov - crypt',
        );

      // Control content title is set if provider has no logo
      cy.get('[data-testid="idp-621c3c17-5f49-4ca5-b8ef-a4b1cecaf7c2"]').should(
        'exist',
      );
      // Control that the right text is set
      cy.get(
        '[data-testid="idp-621c3c17-5f49-4ca5-b8ef-a4b1cecaf7c2"]',
      ).contains('FIP3 - FI désactivé mais visible');
    });
  });

  it('should redirect when click on enabled IdP with discovery', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get(
      '[data-testid="main-providers"] button#idp-0cbdf732-aaea-4566-a99e-4430f388ff18',
    ).click();
    // Then
    cy.url().should('match', new RegExp(`^https://fip1-high.+$`));
  });

  it('should not display an enabled IdP with discovery url but no discovery parameter', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(
      '[data-testid="main-providers"] button#idp-ad0ed11b-621b-45e9-af75-64f27ced6d52',
    ).should('not.exist');
  });

  it('should not display an enabled IdP with discovery but no discovery url', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(
      '[data-testid="main-providers"] button#idp-b4ae876d-773c-4b4a-bd45-33e0938af4a7',
    ).should('not.exist');
  });

  it('should not display an enabled IdP with discovery and forbidden parameters', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(
      '[data-testid="main-providers"] button#idp-a97369fb-f7b0-478a-bcc1-6fa49c8782d9',
    ).should('not.exist');
  });

  it('should redirect when click on enabled IdP with jwksUrl and right config', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // When
    cy.get(
      '[data-testid="main-providers"] button#idp-a437f8aa-10b5-48bd-8931-78f2d055e3df',
    ).click();
    // Then
    cy.url().should('match', new RegExp(`^https://fip1-high.+$`));
  });

  it('should not display an enabled IdP with jwksUrl and wrong config', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(
      '[data-testid="main-providers"] button#idp-7f90ea0f-b965-4f10-bbf8-d6ad19a17451',
    ).should('not.exist');
  });

  it('should not display an enabled IdP without discovery and missing parameters', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    // Then
    cy.get(
      `[data-testid="main-providers"] button#idp-ad0ed11b-621b-45e9-af75-64f27ced6d52`,
    ).should('not.exist');
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
    cy.get(
      '[data-testid="fs-request-dedc7160-8811-4d0f-9dd7-c072c15f2f18"]',
    ).within(() => {
      cy.get('input[name="providerUid"]').invoke(
        'attr',
        'value',
        'random-non-exisitig-IdP',
      );
      cy.get(
        '[data-testid="idp-dedc7160-8811-4d0f-9dd7-c072c15f2f18"]',
      ).click();
    });
    // Then
    cy.url().should('contain', '/api/v2/redirect-to-idp');
    cy.hasError('Y020019');
  });

  it('should trigger error Y190007 if the CSRF token is not valid', () => {
    // Given
    cy.visit(getAuthorizeUrl());
    cy.url().should('match', mireUrl);
    cy.get(
      '[data-testid="fs-request-dedc7160-8811-4d0f-9dd7-c072c15f2f18"] > input[name="csrfToken"]',
    )
      // Reset CSRF form value
      .invoke('attr', 'value', 'INVALID-CSRF-VALUE');
    // When
    cy.get(
      '[data-testid="main-providers"] button#idp-dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    ).click();
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
      cy.get('[data-testid="main-providers"]')
        .contains('Idp test Inserted')
        .should('not.exist');

      cy.e2e('idp_insert');
      cy.wait(500);
      cy.reload();

      cy.get('[data-testid="main-providers"]').contains('Idp test Inserted');
    });

    it('should update an identity provider properties, activate it, without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('[data-testid="main-providers"]')
        .contains('Idp test Inserted')
        .should('not.exist');

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();

      cy.get('[data-testid="main-providers"]').contains(
        'Idp test Updated, activated',
      );
    });

    it('should update an identity provider properties, deactivate it, without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('[data-testid="idp-da5bbb8d-3a93-4434-b1bf-448c69fa7fc9"]').should(
        'not.exist',
      );

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();

      cy.get('[data-testid="idp-da5bbb8d-3a93-4434-b1bf-448c69fa7fc9"]')
        .contains('Idp test Updated, activated')
        .should('exist');

      cy.e2e('idp_update_desactivate');
      cy.wait(500);
      cy.reload();

      cy.get('[data-testid="main-providers"]').contains(
        'Idp test Updated, desactivated',
      );
      cy.get(
        '[data-testid="idp-da5bbb8d-3a93-4434-b1bf-448c69fa7fc9"] [data-testid="idp-status-description"]',
      ).contains('Indisponible');
    });

    it('should remove an identity provider without an app restart needed', () => {
      cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
      setFSAuthorizeAcr('eidas2');
      submitFSAuthorizeForm();
      cy.get('[data-testid="main-providers"]')
        .contains('da5bbb8d-3a93-4434-b1bf-448c69fa7fc9')
        .should('not.exist');

      cy.e2e('idp_insert');
      cy.e2e('idp_update_activate');
      cy.wait(500);
      cy.reload();
      cy.get('[data-testid="main-providers"]')
        .contains('Idp test Updated, activated')
        .should('exist');

      cy.e2e('idp_remove');
      cy.wait(500);
      cy.reload();
      cy.get('[data-testid="main-providers"]')
        .contains('Idp test Updated, activated')
        .should('not.exist');
    });
  });
});
