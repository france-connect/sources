import { After, Before, Given } from '@badeball/cypress-cucumber-preprocessor';
import { Context } from 'mocha';

import {
  addFCBasicAuthorization,
  clearBusinessLog,
  disableSameSiteLax,
  getDefaultIdentityProvider,
  getDefaultServiceProvider,
  getDefaultUser,
  isUsingFCBasicAuthorization,
} from '../helpers';
import { IdentityProviderInterface, ServiceProvider, UserData } from '../types';

const setFixtureContext = (
  fixture: string,
  pathArray: string[],
  contextName: string,
): void => {
  cy.task('getFixturePath', { fixture, pathArray }).then(
    (fixturePath: string) => {
      cy.log(fixturePath);
      cy.fixture(fixturePath).as(contextName);
    },
  );
};

const setupTestFramework = (
  platform: string,
  testEnv: string,
  ctx: Context,
): void => {
  const pathArray = [platform, testEnv];
  setFixtureContext('environment.json', pathArray, 'env');
  setFixtureContext('api-common.json', pathArray, 'apiRequests');
  setFixtureContext('service-providers.json', pathArray, 'serviceProviders');
  setFixtureContext('service-provider-configs.json', pathArray, 'spConfigs');
  setFixtureContext('identity-providers.json', pathArray, 'identityProviders');
  setFixtureContext('identity-provider-configs.json', pathArray, 'idpConfigs');
  setFixtureContext('scopes.json', pathArray, 'scopes');
  setFixtureContext('users.json', pathArray, 'users');

  if (platform === 'fcp-low') {
    setFixtureContext('rep-scopes.json', pathArray, 'repScopes');
    setFixtureContext('fraud-form-values.json', pathArray, 'fraudFormValues');
  }

  // Define default data
  cy.get<ServiceProvider[]>('@serviceProviders').then((serviceProviders) => {
    ctx.serviceProvider = getDefaultServiceProvider(serviceProviders);
  });
  cy.get<IdentityProviderInterface[]>('@identityProviders').then(
    (identityProviders) => {
      ctx.identityProvider = getDefaultIdentityProvider(identityProviders);
    },
  );
  cy.get<UserData[]>('@users').then((users) => {
    ctx.user = getDefaultUser(users);
  });
  // Stores CSV files content used in scenarios
  ctx.csvFiles = {};

  // Setup interceptions to add basic authorization header on FC requests
  if (isUsingFCBasicAuthorization()) {
    addFCBasicAuthorization();
  }

  if (testEnv === 'docker') {
    clearBusinessLog();
    const eidasLogPath = Cypress.env('EIDAS_LOG_FILE_PATH');
    if (eidasLogPath) {
      clearBusinessLog(eidasLogPath);
    }
  } else if (testEnv === 'integ01') {
    // Setup interceptions to override set-cookie samesite values
    const crossDomains = {
      FC: 'dev-franceconnect.fr',
      FI: 'fournisseur-d-identite.fr',
      FS: 'fournisseur-de-service.fr',
    };
    disableSameSiteLax(crossDomains);
  }
};

Before(function () {
  // Load environment config and test data
  const platform: string = Cypress.env('PLATFORM');
  const testEnv: string = Cypress.env('TEST_ENV');
  setupTestFramework(platform, testEnv, this);
});

Given(
  /^j'utilise la plateforme "(FranceConnect\(v2\)|FranceConnect\(CL\)|FranceConnect\+)"$/,
  function (plateformName: string) {
    const platformMapping = {
      'FranceConnect(CL)': 'fcp-legacy',
      'FranceConnect(v2)': 'fcp-low',
      'FranceConnect+': 'fcp-high',
    };
    const platform = platformMapping[plateformName];
    const testEnv: string = Cypress.env('TEST_ENV');
    setupTestFramework(platform, testEnv, this);
  },
);

/**
 * @todo Need refactor to handle increasing number of context variables
 * author: Nicolas
 * date: 18/05/2021
 */
After(function () {
  // Delete the Context variable changed during the scenario
  delete this.requestedScope;
  delete this.serviceProvider;
  delete this.identityProvider;
  delete this.user;
  delete this.operatorUser;
});

Before({ tags: '@ignoreDocker' }, function () {
  if (['docker', 'recette'].includes(Cypress.env('TEST_ENV'))) {
    this.skip();
  }
});

Before({ tags: '@ignoreInteg01' }, function () {
  if (Cypress.env('TEST_ENV') === 'integ01') {
    this.skip();
  }
});

Before({ tags: '@clearExploitBusinessLogs' }, function () {
  if (Cypress.env('TEST_ENV') === 'docker') {
    const logPath = Cypress.env('EXPLOIT_LOG_FILE_PATH');
    clearBusinessLog(logPath);
  }
});
