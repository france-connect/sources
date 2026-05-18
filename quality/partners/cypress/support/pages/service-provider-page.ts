import { getMissingIdentityScopes, isRecent } from '../helpers';
import {
  AccountPermissionInterface,
  ChainableElement,
  InstanceInterface,
  ServiceProvider,
  ServiceProviderResponse,
} from '../types';

export default class ServiceProviderPage {
  getTitle(title: string): ChainableElement {
    return cy.contains('h1', title);
  }

  getDatapassRequestIdLink(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-details-page-datapass-request-id"]',
    );
  }

  checkIsErrorPageVisible(): void {
    cy.contains('h1', 'Vous ne voyez pas de fournisseur de service ?').should(
      'be.visible',
    );
  }

  getOrganizationName(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-details-page-organization-name"]',
    );
  }

  getDatapassScopesList(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-scopes-tabs-datapass-scope"]',
    );
  }

  getFcScopesList(): ChainableElement {
    return cy.get('[data-testid="service-provider-scopes-tabs-fc-scope"]');
  }

  getFcScopesTabButton(): ChainableElement {
    return cy.get('[data-testid="fc-scopes-tab-button"]');
  }

  checkTabPanelVisible(tabId: string): void {
    cy.get(
      `[data-testid="service-provider-scopes-tabs-panel-${tabId}"]`,
    ).should('be.visible');
  }

  getLinkInstancesSuccessAlert(): ChainableElement {
    return cy.get('[data-testid="service-provider-link-success-alert"]');
  }

  getSandboxesEmptyAlert(): ChainableElement {
    return cy.get('[data-testid="service-provider-sandboxes-empty-alert"]');
  }

  getSandboxesTable(): ChainableElement {
    return cy.get('#service-provider-sandboxes-table table');
  }

  getSandboxTableRow(instanceName: string): ChainableElement {
    return this.getSandboxesTable().contains('tbody tr', instanceName);
  }

  getSandboxCard(sandboxId: string): ChainableElement {
    return cy.get(`[data-testid="service-provider-sandbox-card-${sandboxId}"]`);
  }

  checkServiceProviderDetails(serviceProvider: ServiceProvider): void {
    this.getTitle(serviceProvider.name).should('be.visible');
    this.getOrganizationName()
      .should('be.visible')
      .and('have.text', serviceProvider.organizationName);
    this.getDatapassRequestIdLink()
      .should('be.visible')
      .and('have.text', serviceProvider.datapassRequestId);
  }

  getServiceProviderIdFromUrl(): Cypress.Chainable<string> {
    return cy.url().then((url) => {
      const match = url.match(/\/fournisseurs-de-service\/([^/?#]+)$/);
      expect(match, 'service provider uuid in page url').to.not.be.null;
      return match?.[1] as string;
    });
  }

  checkInstancesUpdated(
    partnersRootUrl: string,
    serviceProviderId: string,
  ): void {
    // Call service provider details API to check instances data
    cy.api(
      `${partnersRootUrl}/api/service-providers/${serviceProviderId}`,
    ).then((response) => {
      expect(response.status).to.equal(200);

      const { fcScopes, instances } = response.body
        .payload as ServiceProviderResponse['payload'];
      expect(fcScopes, 'payload.fcScopes')
        .to.be.an('array')
        .and.have.length.greaterThan(0);
      expect(instances, 'payload.instances')
        .to.be.an('array')
        .and.have.length.greaterThan(0);

      instances.forEach((instance) => {
        this.checkCurrentVersionUpdated(
          instance.currentVersion,
          fcScopes as string[],
        );
      });
    });
  }

  checkFirstInstanceUpdated(
    partnersRootUrl: string,
    serviceProviderId: string,
  ): void {
    // Call service provider details API to check instances data
    cy.api(
      `${partnersRootUrl}/api/service-providers/${serviceProviderId}`,
    ).then((response) => {
      expect(response.status).to.equal(200);

      const { fcScopes, instances } = response.body
        .payload as ServiceProviderResponse['payload'];
      expect(fcScopes, 'payload.fcScopes')
        .to.be.an('array')
        .and.have.length.greaterThan(0);
      expect(instances, 'payload.instances')
        .to.be.an('array')
        .and.have.length.greaterThan(0);

      // Last created or linked instance
      const { currentVersion } = instances[0];
      this.checkCurrentVersionUpdated(currentVersion, fcScopes as string[]);
    });
  }

  private checkCurrentVersionUpdated(
    version: InstanceInterface['currentVersion'],
    expectedScopes: string[],
  ): void {
    // Check that instance has been published recently
    expect(isRecent(version.createdAt), 'currentVersion.createdAt is recent').to
      .be.true;
    expect(isRecent(version.updatedAt), 'currentVersion.updatedAt is recent').to
      .be.true;
    expect(version.publicationStatus).to.equal('PUBLISHED');
    // Check that instance scopes have been updated with the expected identityscopes
    const notExpectedScopes = getMissingIdentityScopes(expectedScopes);
    expectedScopes.forEach((scope) => {
      expect(
        version.data.scope,
        `currentVersion.data.scope contains '${scope}'`,
      ).to.include(scope);
    });
    notExpectedScopes.forEach((scope) => {
      expect(
        version.data.scope,
        `currentVersion.data.scope does not contain '${scope}'`,
      ).to.not.include(scope);
    });
  }

  getLinkInstancesButton(): ChainableElement {
    return cy.get('[data-testid="service-provider-link-instances-button"]');
  }

  checkPermissionsUpdated(
    partnersRootUrl: string,
    serviceProviderId: string,
    spAdminEmail: string,
    spTechEmail: string,
  ): void {
    // Call service provider details API to check permissions data
    cy.api(
      `${partnersRootUrl}/api/service-providers/${serviceProviderId}`,
    ).then((response) => {
      expect(response.status).to.equal(200);

      const { permissions } = response.body
        .meta as ServiceProviderResponse['meta'];
      expect(permissions, 'payload.permissions')
        .to.be.an('array')
        .and.have.length.greaterThan(0);

      checkUniquePermissionType(permissions, 'SP_ADMIN');
      checkUniquePermissionType(permissions, 'SP_TECH');

      const { account: spAdminAccount } = getAccountPermission(
        permissions,
        'SP_ADMIN',
      );
      expect(spAdminAccount.email, 'SP_ADMIN email').to.equal(spAdminEmail);

      const { account: spTechAccount } = getAccountPermission(
        permissions,
        'SP_TECH',
      );
      expect(spTechAccount.email, 'SP_TECH email').to.equal(spTechEmail);
    });
  }

  checkAccountUpdated(
    partnersRootUrl: string,
    serviceProviderId: string,
    claims: Record<string, string>,
    permissionType: string,
    isUpdated = true,
  ): void {
    expect(permissionType).to.be.oneOf(
      ['SP_ADMIN', 'SP_TECH'],
      'permissionType should be either SP_ADMIN or SP_TECH',
    );
    // Call service provider details API to check account data
    cy.api(
      `${partnersRootUrl}/api/service-providers/${serviceProviderId}`,
    ).then((response) => {
      expect(response.status).to.equal(200);

      const { permissions } = response.body
        .meta as ServiceProviderResponse['meta'];
      expect(permissions, 'payload.permissions')
        .to.be.an('array')
        .and.have.length.greaterThan(0);

      checkUniquePermissionType(permissions, permissionType);
      const { account: actualAccount } = getAccountPermission(
        permissions,
        permissionType,
      );

      const expectedAccount = {
        ...(claims.email && { email: claims.email }),
        ...(claims.given_name && { firstname: claims.given_name }),
        ...(claims.usual_name && { lastname: claims.usual_name }),
        ...(claims.phone_number && { phone: claims.phone_number }),
      };

      if (isUpdated) {
        // all account data should match the Datapass data
        expect(
          actualAccount,
          `${permissionType} account should be up to date`,
        ).to.deep.include(expectedAccount);
      } else {
        // only phone and email should match the Datapass data
        expect(
          actualAccount,
          `${permissionType} account should not be fully updated`,
        ).to.not.deep.include(expectedAccount);
        expect(
          actualAccount.email,
          `${permissionType} account email should be ${claims.email}`,
        ).to.equal(claims.email);
        expect(
          actualAccount.phone,
          `${permissionType} account phone should be ${claims.phone_number}`,
        ).to.equal(claims.phone_number);
      }
    });
  }

  checkAccountClaims(
    partnersRootUrl: string,
    serviceProviderId: string,
    claims: Record<string, string>,
    permissionType: string,
  ): void {
    // Call service provider details API to check account data
    cy.api(
      `${partnersRootUrl}/api/service-providers/${serviceProviderId}`,
    ).then((response) => {
      expect(response.status).to.equal(200);

      const { permissions } = response.body
        .meta as ServiceProviderResponse['meta'];
      expect(permissions, 'payload.permissions')
        .to.be.an('array')
        .and.have.length.greaterThan(0);

      const accountPermission = getAccountPermission(
        permissions,
        permissionType,
      );
      const actualClaims = accountPermission.account;

      const expectedClaims = {
        ...(claims.email && { email: claims.email }),
        ...(claims.given_name && { firstname: claims.given_name }),
        ...(claims.usual_name && { lastname: claims.usual_name }),
        ...(claims.phone_number && { phone: claims.phone_number }),
      };

      expect(
        actualClaims,
        `${permissionType} account claims should match claims`,
      ).to.deep.include(expectedClaims);
    });
  }
}

const checkUniquePermissionType = (
  permissions: AccountPermissionInterface[],
  permissionType: string,
): void => {
  expect(
    permissions.filter(
      (permission) => permission.permissionType === permissionType,
    ),
    `Only one ${permissionType} permission should be found for this service provider`,
  ).to.have.lengthOf(1);
};

const getAccountPermission = (
  permissions: AccountPermissionInterface[],
  permissionType: string,
): AccountPermissionInterface => {
  const accountPermission = permissions.find(
    (permission) => permission.permissionType === permissionType,
  );
  expect(
    accountPermission,
    `No ${permissionType} permission found for this service provider`,
  ).to.exist;
  return accountPermission as AccountPermissionInterface;
};
