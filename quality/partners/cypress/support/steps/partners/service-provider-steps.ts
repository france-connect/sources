import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { getUserByDescription } from '../../helpers';
import ServiceProviderPage from '../../pages/service-provider-page';

const serviceProviderPage = new ServiceProviderPage();

Then(
  /^le titre du fournisseur de service "([^"]+)" est affiché$/,
  function (title: string) {
    serviceProviderPage.getTitle(title).should('be.visible');
  },
);

Then(
  'je suis redirigé vers la page détails du fournisseur de service',
  function () {
    serviceProviderPage.getDatapassRequestIdLink().should('be.visible');
    // Store service provider id from URL for later API calls
    serviceProviderPage.getServiceProviderIdFromUrl().as('serviceProviderId');
  },
);

Then(
  "je suis redirigé vers la page d'erreur du fournisseur de service",
  function () {
    serviceProviderPage.checkIsErrorPageVisible();
  },
);

Then(
  /^le nom de l'organisation "([^"]+)" est affiché$/,
  function (organizationName: string) {
    serviceProviderPage
      .getOrganizationName()
      .should('be.visible')
      .and('have.text', organizationName);
  },
);

Then(
  /^le numéro de la demande Datapass "([^"]+)" est affiché$/,
  function (requestId: string) {
    serviceProviderPage
      .getDatapassRequestIdLink()
      .should('be.visible')
      .and('have.text', requestId);
  },
);

Then(
  'le fournisseur de service est à jour avec les informations Datapass',
  function () {
    serviceProviderPage.checkServiceProviderDetails(this.serviceProvider);
  },
);

Then(
  'les scopes Datapass suivants sont affichés:',
  function (dataTable: DataTable) {
    const expectedScopes = dataTable.raw().map((row) => row[0]);

    serviceProviderPage
      .getDatapassScopesList()
      .should('have.length', expectedScopes.length);

    expectedScopes.forEach((scope) => {
      serviceProviderPage.getDatapassScopesList().should('contain.text', scope);
    });
  },
);

When("je clique sur l'onglet scopes autorisés", function () {
  serviceProviderPage.getFcScopesTabButton().click();
});

Then(
  /^je suis redirigé vers l'onglet (données autorisées|scopes autorisés)$/,
  function (tabType: string) {
    const tabMapping: Record<string, string> = {
      'données autorisées': 'datapass-scopes-tab-button',
      'scopes autorisés': 'fc-scopes-tab-button',
    };
    serviceProviderPage.checkTabPanelVisible(tabMapping[tabType]);
  },
);

Then(
  'les scopes FranceConnect suivants sont affichés:',
  function (dataTable: DataTable) {
    const expectedScopes = dataTable.raw().map((row) => row[0]);

    serviceProviderPage
      .getFcScopesList()
      .should('have.length', expectedScopes.length);

    expectedScopes.forEach((scope) => {
      serviceProviderPage.getFcScopesList().should('contain.text', scope);
    });
  },
);

Then(
  "l'instance liée au fournisseur de service est à jour avec les informations Datapass",
  function () {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    serviceProviderPage.checkFirstInstanceUpdated(
      partnersRootUrl,
      this.serviceProviderId,
    );
  },
);

Then(
  'les instances du fournisseur de service sont à jour avec les informations Datapass',
  function () {
    expect(this.serviceProviderId, 'service provider id').to.exist;
    const { partnersRootUrl } = this.env;
    serviceProviderPage.checkInstancesUpdated(
      partnersRootUrl,
      this.serviceProviderId,
    );
  },
);

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

    serviceProviderPage.checkPermissionsUpdated(
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

    serviceProviderPage.checkAccountUpdated(
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

    serviceProviderPage.checkAccountClaims(
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

    serviceProviderPage.checkAccountUpdated(
      partnersRootUrl,
      this.serviceProviderId,
      user.claims,
      permissionType,
      false,
    );
  },
);

Then(
  /^le bouton relier les instances (est|n'est pas) affiché$/,
  function (text) {
    const isDisplayed = text === 'est';
    serviceProviderPage
      .getLinkInstancesButton()
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);

When('je clique sur le bouton relier les instances', function () {
  serviceProviderPage.getLinkInstancesButton().click();
});

Then("l'alerte de succès de liaison des instances est affichée", function () {
  serviceProviderPage
    .getLinkInstancesSuccessAlert()
    .should('be.visible')
    .and('contain.text', 'Instance reliée avec succès !');
});

Then(
  /^l'instance "([^"]+)" (est|n'est pas) présente dans le tableau des accès au bac à sable$/,
  function (instanceName: string, text: string) {
    const isDisplayed = text === 'est';
    serviceProviderPage
      .getSandboxTableRow(instanceName)
      .should(isDisplayed ? 'be.visible' : 'not.exist');
  },
);
