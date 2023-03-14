import { When } from 'cypress-cucumber-preprocessor/steps';

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
import IdentityProviderSelectionPage from '../pages/identity-provider-selection-page';
import InfoConsentPage from '../pages/info-consent-page';
import ServiceProviderPage from '../pages/service-provider-page';
import TechnicalErrorPage from '../pages/technical-error-page';

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
   * Navigate to the service provider
   * @returns l'instance de ConnectionWorkflow
   */
  init(): this {
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
  withScope(scopeContext: ScopeContext): this {
    this.scopeContext = scopeContext;
    return this;
  }

  /**
   * Start the connection clicking on the FranceConnect button
   * @returns the current ConnectionWorkflow instance
   */
  start(): this {
    this.serviceProviderPage.startLogin(this.fcRootUrl, this.scopeContext);
    return this;
  }

  /**
   * Check whether the IDP selection page is displayed
   */
  checkIdpSelectionPageDisplayed(): this {
    const identityProviderSelectionPage = new IdentityProviderSelectionPage();
    identityProviderSelectionPage.checkIsVisible();
    return this;
  }

  /**
   * Select the identity provider in the identity providers list
   * @param identityProvider the identity provider to select
   * @returns the current ConnectionWorkflow instance
   */
  selectIdentityProvider(identityProvider: IdentityProvider): this {
    this.identityProvider = identityProvider;
    const identityProviderSelectionPage = new IdentityProviderSelectionPage();
    identityProviderSelectionPage.checkIsVisible();
    identityProviderSelectionPage.getIdpButton(identityProvider).click();
    return this;
  }

  /**
   * Log the user in on the identity provider page
   * @param user user with its credentials
   * @returns the current ConnectionWorkflow instance
   */
  login(user: User): this {
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
  consent(): this {
    const infoConsent = new InfoConsentPage();
    // Check the consent checkbox for private SP with claims requested
    if (
      this.serviceProvider.explicitConsent &&
      this.scopeContext.type !== 'anonyme'
    ) {
      infoConsent.getConsentCheckboxLabel().click();
    }
    infoConsent.getConsentButton().click();
    return this;
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkIsConnected(): this {
    this.serviceProviderPage.checkIsUserConnected();
    return this;
  }

  logout(): void {
    this.serviceProviderPage.logout();
  }
}

When("l'usager peut se connecter à FranceConnect", function () {
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
    .checkIsConnected()
    .logout();
});

When("j'ai fait une cinématique FranceConnect", function () {
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
    .checkIsConnected()
    .logout();
});

When('je me connecte à FranceConnect', function () {
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
    .checkIsConnected();
});

When("je me connecte au fournisseur d'identité via FranceConnect", function () {
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
});

When("l'usager ne peut pas se connecter à FranceConnect", function () {
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
