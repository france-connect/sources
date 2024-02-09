import { When } from '@badeball/cypress-cucumber-preprocessor';

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
import InteractionPage from '../pages/interaction-page';
import ServiceProviderPage from '../pages/service-provider-page';
import TechnicalErrorPage from '../pages/technical-error-page';

class ConnectionWorkflow {
  allAppsUrl: string;
  serviceProvider: ServiceProvider;
  identityProvider: IdentityProvider;
  serviceProviderPage: ServiceProviderPage;
  email: string;

  constructor({ allAppsUrl }: Environment, serviceProvider: ServiceProvider) {
    this.allAppsUrl = allAppsUrl;
    this.serviceProvider = serviceProvider;
  }

  /**
   * Navigate to the service provider and setup the ServiceProviderPage
   * @returns the current ConnectionWorkflow instance
   */
  init(): this {
    navigateTo({
      appId: this.serviceProvider.name,
      baseUrl: this.allAppsUrl,
    });
    this.serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
    return this;
  }

  /**
   * Set the scopes based on the scope context
   * @param scopeContext scope context to be used by the Workflow
   * @returns the current ConnectionWorkflow instance
   */
  withScope(scopeContext: ScopeContext): this {
    this.serviceProviderPage.setMockRequestedScope(scopeContext);
    return this;
  }

  /**
   * Start the connection clicking on the AgentConnect button
   * @returns the current ConnectionWorkflow instance
   */
  start(): this {
    this.serviceProviderPage.getFcaButton().click();
    return this;
  }

  /**
   * Select the identity provider in the identity providers list
   * @param identityProvider the identity provider to select
   * @returns the current ConnectionWorkflow instance
   */
  redirectToIdp(email: string): this {
    const interactionPage = new InteractionPage();
    interactionPage.checkIsVisible();
    interactionPage.getEmail().clearThenType(email);
    interactionPage.getConnectionButton().click();
    return this;
  }

  /**
   * Log the user in on the identity provider page
   * @param user user with its credentials
   * @returns the current ConnectionWorkflow instance
   */
  login(user: User, identityProvider: IdentityProvider): this {
    this.identityProvider = identityProvider;

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
  checkHasError(): void {
    const technicalErrorPage = new TechnicalErrorPage();
    technicalErrorPage.checkIsVisible();
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkIsConnected(): void {
    this.serviceProviderPage.checkIsUserConnected();
  }
}

When(/^je me connecte à AgentConnect$/, function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.scopes).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = this.requestedScope || getDefaultScope(this.scopes);
  const email = `default@${this.identityProvider.fqdn}`;

  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .redirectToIdp(email)
    .login(this.user, this.identityProvider)
    .checkIsConnected();
});
