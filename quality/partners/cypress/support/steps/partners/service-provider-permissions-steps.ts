import { Then } from '@badeball/cypress-cucumber-preprocessor';

import { getUserByDescription } from '../../helpers';
import ServiceProviderPermissionsSection from '../../pages/service-provider-permissions';

const serviceProviderPermissionsSection =
  new ServiceProviderPermissionsSection();

Then(
  'les permissions du fournisseur de service sont à jour avec les informations Datapass',
  function () {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    const { applicantUserDescription, technicalUserDescription } =
      this.serviceProvider;
    const applicantUser = getUserByDescription(
      this.users,
      applicantUserDescription,
    );
    const technicalUser = getUserByDescription(
      this.users,
      technicalUserDescription,
    );
    const spAdminEmail = applicantUser.claims.email;
    const spTechEmail = technicalUser.claims.email;

    serviceProviderPermissionsSection.checkPermissionsUpdated(
      partnersRootUrl,
      this.serviceProviderId,
      spAdminEmail,
      spTechEmail,
    );
  },
);

Then(
  /^le compte du (demandeur|contact technique) est à jour avec les informations Datapass$/,
  function (userType: string) {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    const descriptionAttribute =
      userType === 'demandeur'
        ? 'applicantUserDescription'
        : 'technicalUserDescription';
    const userDescription = this.serviceProvider[descriptionAttribute];
    const user = getUserByDescription(this.users, userDescription);

    const permissionType = userType === 'demandeur' ? 'SP_ADMIN' : 'SP_TECH';

    serviceProviderPermissionsSection.checkAccountUpdated(
      partnersRootUrl,
      this.serviceProviderId,
      user.claims,
      permissionType,
    );
  },
);

Then(
  /^le compte du (demandeur|contact technique) a le numéro de téléphone "([^"]+)"$/,
  function (userType: string, phoneNumber: string) {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    const permissionType = userType === 'demandeur' ? 'SP_ADMIN' : 'SP_TECH';

    const expectedClaims = {
      phone_number: phoneNumber,
    };

    serviceProviderPermissionsSection.checkAccountClaims(
      partnersRootUrl,
      this.serviceProviderId,
      expectedClaims,
      permissionType,
    );
  },
);

Then(
  /^seul le numéro de téléphone du (demandeur|contact technique) a été mis à jour avec les informations Datapass$/,
  function (userType: string) {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    const descriptionAttribute =
      userType === 'demandeur'
        ? 'applicantUserDescription'
        : 'technicalUserDescription';
    const userDescription = this.serviceProvider[descriptionAttribute];
    const user = getUserByDescription(this.users, userDescription);

    const permissionType = userType === 'demandeur' ? 'SP_ADMIN' : 'SP_TECH';

    serviceProviderPermissionsSection.checkAccountUpdated(
      partnersRootUrl,
      this.serviceProviderId,
      user.claims,
      permissionType,
      false,
    );
  },
);
