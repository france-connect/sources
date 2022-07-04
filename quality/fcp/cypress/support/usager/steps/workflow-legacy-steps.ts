import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo, User } from '../../common/helpers';
import {
  Environment,
  IdentityProvider,
  ScopeContext,
  ServiceProvider,
  UserCredentials,
} from '../../common/types';
import { getDefaultScope } from '../helpers';
import IdentityProviderPage from '../pages/identity-provider-page';
import {
  IdentityProviderSelectionPage,
  InfoConsentPage,
  TechnicalErrorPage,
} from '../pages/legacy-pages';
import ServiceProviderPage from '../pages/service-provider-legacy-page';

export class ConnectionWorkflow {
  allAppsUrl: string;
  fcRootUrl: string;
  serviceProvider: ServiceProvider;
  identityProvider: IdentityProvider;
  serviceProviderPage: ServiceProviderPage;
  scopeContext: ScopeContext;

  constructor(
    { allAppsUrl, fcRootUrl }: Environment,
    serviceProvider: ServiceProvider,
  ) {
    this.allAppsUrl = allAppsUrl;
    this.fcRootUrl = fcRootUrl;
    this.serviceProvider = serviceProvider;
    this.serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
  }

  /**
   * Navigate to the service provider and setup the ServiceProviderPage
   * @returns l'instance de ConnectionWorkflow
   */
  init(): ConnectionWorkflow {
    navigateTo({
      appId: this.serviceProvider.name,
      baseUrl: this.allAppsUrl,
    });
    return this;
  }

  /**
   * Set the scopes based on the scope context
   * @param scopeContext scope context to be used by the Workflow
   * @returns the current ConnectionWorkflow instance
   */
  withScope(scopeContext: ScopeContext): ConnectionWorkflow {
    this.scopeContext = scopeContext;
    return this;
  }

  /**
   * Start the connection clicking on the FranceConnect button
   * @returns the current ConnectionWorkflow instance
   */
  start(): ConnectionWorkflow {
    const DEFAULT_ACR_VALUES = 'eidas1';
    this.serviceProviderPage.startLogin(
      this.fcRootUrl,
      this.scopeContext,
      DEFAULT_ACR_VALUES,
    );
    return this;
  }

  /**
   * Check whether the IDP selection page is displayed
   */
  checkIdpSelectionPageDisplayed(): ConnectionWorkflow {
    const identityProviderSelectionPage = new IdentityProviderSelectionPage();
    identityProviderSelectionPage.checkIsVisible();
    return this;
  }

  /**
   * Select the identity provider in the identity providers list
   * @param identityProvider the identity provider to select
   * @returns the current ConnectionWorkflow instance
   */
  selectIdentityProvider(
    identityProvider: IdentityProvider,
  ): ConnectionWorkflow {
    this.identityProvider = identityProvider;
    const identityProviderSelectionPage = new IdentityProviderSelectionPage();
    identityProviderSelectionPage.getIdpButton(this.identityProvider).click();
    return this;
  }

  /**
   * Log the user in on the identity provider page
   * @param user user with its credentials
   * @returns the current ConnectionWorkflow instance
   */
  login(user: User): ConnectionWorkflow {
    const identityProviderPage = new IdentityProviderPage(
      this.identityProvider,
    );
    const credentials: UserCredentials = user.getCredentials(
      this.identityProvider.idpId,
    );
    expect(credentials).to.exist;
    identityProviderPage.login(credentials);
    return this;
  }

  /**
   * Check that the technical error page is displayed
   */
  checkError(): void {
    const technicalErrorPage = new TechnicalErrorPage();
    technicalErrorPage.checkIsVisible();
  }

  /**
   * Accept the sharing of the user information to the service provider
   * @returns the current ConnectionWorkflow instance
   */
  consent(): ConnectionWorkflow {
    const infoConsent = new InfoConsentPage();
    // Check the consent checkbox for private SP with claims requested
    if (
      this.serviceProvider.explicitConsent &&
      this.scopeContext.type !== 'anonyme'
    ) {
      infoConsent.getConsentCheckbox().check();
    }
    infoConsent.getConsentButton().click();
    return this;
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkConnected(): this {
    this.serviceProviderPage.checkIsUserConnected();
    return this;
  }

  logout(): void {
    this.serviceProviderPage.logout();
  }
}

When("l'usager peut se connecter à FranceConnect Legacy", function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.scopes).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = this.requestedScope || getDefaultScope(this.scopes);
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .consent()
    .checkConnected()
    .logout();
});

When("j'ai fait une cinématique FranceConnect Legacy", function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.scopes).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = this.requestedScope || getDefaultScope(this.scopes);
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .consent()
    .checkConnected()
    .logout();
});

When('je me connecte à FranceConnect Legacy', function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.scopes).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = this.requestedScope || getDefaultScope(this.scopes);
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .consent()
    .checkConnected();
});

When(
  "je me connecte au fournisseur d'identité via FranceConnect Legacy",
  function () {
    expect(this.env).to.exist;
    expect(this.serviceProvider).to.exist;
    expect(this.scopes).to.exist;
    expect(this.identityProvider).to.exist;
    expect(this.user).to.exist;
    const scopes = this.requestedScope || getDefaultScope(this.scopes);
    new ConnectionWorkflow(this.env, this.serviceProvider)
      .init()
      .withScope(scopes)
      .start()
      .selectIdentityProvider(this.identityProvider)
      .login(this.user);
  },
);

When("l'usager ne peut pas se connecter à FranceConnect Legacy", function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.scopes).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = this.requestedScope || getDefaultScope(this.scopes);
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .checkError();
});

Then(
  'je suis connecté sur la page du fournisseur de service Legacy',
  function () {
    expect(this.env).to.exist;
    expect(this.serviceProvider).to.exist;
    new ConnectionWorkflow(this.env, this.serviceProvider).checkConnected();
  },
);
