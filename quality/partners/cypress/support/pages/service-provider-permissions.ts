import { AccountPermissionInterface, ServiceProviderResponse } from '../types';

export default class ServiceProviderPermissions {
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

  checkContributorInTable(email: string): void {
    cy.get('#service-provider-permissions')
      .contains('tbody tr', email.toLowerCase())
      .should('be.visible');
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
