import { Given } from '@badeball/cypress-cucumber-preprocessor';

import {
  generateSiret,
  getRandomNumberStringWithLength,
  getServiceProviderByDescription,
  getUserByDescription,
} from '../../helpers';

Given(
  /^j'utilise (?:un|le) fournisseur de service "([^"]+)"$/,
  function (description: string) {
    this.serviceProvider = getServiceProviderByDescription(
      this.serviceProviders,
      description,
    );
  },
);

Given(
  'le fournisseur de service a un nouveau numéro de demande datapass',
  function () {
    const randomId = getRandomNumberStringWithLength(7);
    this.serviceProvider.datapassRequestId = randomId;
  },
);

Given(
  "le fournisseur de service a un nouveau numéro d'habilitation datapass",
  function () {
    const randomId = getRandomNumberStringWithLength(5);
    this.serviceProvider.datapassAuthorizationId = randomId;
  },
);

Given(
  'le fournisseur de service a pour numéro de demande datapass {string}',
  function (datapassRequestId: string) {
    this.serviceProvider.datapassRequestId = datapassRequestId;
  },
);

Given('le fournisseur de service a pour nom {string}', function (name: string) {
  this.serviceProvider.name = name;
});

Given(
  'le fournisseur de service a pour niveau eidas {string}',
  function (eidasLevel: string) {
    this.serviceProvider.datapassEidasLevel = eidasLevel;
  },
);

Given(
  'le fournisseur de service a pour scopes {string}',
  function (scopes: string) {
    this.serviceProvider.datapassScopes = scopes.split(',');
  },
);

Given(
  'le fournisseur de service a pour organisation {string} avec siret {string}',
  function (organizationName: string, siret: string) {
    this.serviceProvider.organizationName = organizationName;
    this.serviceProvider.organizationSiret = siret;
  },
);

Given(
  'le fournisseur de service a pour organisation {string} avec un nouveau siret',
  function (organizationName: string) {
    const randomSiret = generateSiret();
    this.serviceProvider.organizationName = organizationName;
    this.serviceProvider.organizationSiret = randomSiret;
  },
);

Given(
  /^le fournisseur de service a pour (demandeur|contact technique) datapass "([^"]+)"$/,
  function (userType: string, userDescription: string) {
    const user = getUserByDescription(this.users, userDescription);
    expect(user, `No user matches the description '${userDescription}'`).to
      .exist;
    const attributeName =
      userType === 'demandeur'
        ? 'applicantUserDescription'
        : 'technicalUserDescription';
    this.serviceProvider[attributeName] = userDescription;
  },
);
