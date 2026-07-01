import { getMissingIdentityScopes, isRecent } from '../helpers';
import {
  ChainableElement,
  InstanceInterface,
  ServiceProviderResponse,
} from '../types';

export default class ServiceProviderSandboxesSection {
  getServiceProviderSandboxesSuccessAlert(): ChainableElement {
    return cy.get('[data-testid="service-provider-instance-success-alert"]');
  }

  getSandboxesEmptyAlert(): ChainableElement {
    return cy.get('[data-testid="service-provider-sandboxes-empty-alert"]');
  }

  getLinkInstancesButton(): ChainableElement {
    return cy.get('[data-testid="service-provider-link-instances-button"]');
  }

  getCreateLinkedInstanceButton(): ChainableElement {
    return cy.get('[data-testid="CreateLinkedInstanceButton"]');
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
}
