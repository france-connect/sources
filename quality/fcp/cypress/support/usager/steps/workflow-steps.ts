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

class ConnectionWorkflow {
  allAppsUrl: string;
  serviceProvider: ServiceProvider;
  identityProvider: IdentityProvider;
  serviceProviderPage: ServiceProviderPage;

  constructor({ allAppsUrl }: Environment, serviceProvider: ServiceProvider) {
    this.allAppsUrl = allAppsUrl;
    this.serviceProvider = serviceProvider;
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
    this.serviceProviderPage = new ServiceProviderPage(this.serviceProvider);
    return this;
  }

  /**
   * Set the scopes based on the scope context
   * @param {ScopeContext} scopeContext scope context to be used by the Workflow
   * @returns the current ConnectionWorkflow instance
   */
  withScope(scopeContext: ScopeContext): ConnectionWorkflow {
    this.serviceProviderPage.setMockRequestedScope(scopeContext);
    return this;
  }

  /**
   * Start the connection clicking on the FranceConnect button
   * @returns the current ConnectionWorkflow instance
   */
  start(): ConnectionWorkflow {
    this.serviceProviderPage.fcButton.click();
    return this;
  }

  /**
   * Select the identity provider in the identity providers list
   * @param {IdentityProvider} identityProvider the identity provider to select
   * @returns the current ConnectionWorkflow instance
   */
  selectIdentityProvider(
    identityProvider: IdentityProvider,
  ): ConnectionWorkflow {
    this.identityProvider = identityProvider;
    const identityProviderSelectionPage = new IdentityProviderSelectionPage();
    identityProviderSelectionPage.checkIsVisible();
    identityProviderSelectionPage.getIdpButton(identityProvider.idpId).click();
    return this;
  }

  /**
   * Log the user in on the identity provider page
   * @param {User} user user with its credentials
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
    infoConsent.consentButton.click();
    return this;
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkConnected(): void {
    this.serviceProviderPage.checkIsUserConnected();
  }
}

When("l'usager peut se connecter à FranceConnect", function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(getDefaultScope(this.scopes))
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .consent()
    .checkConnected();
});

When('je me connecte à FranceConnect', function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  const scopes = getDefaultScope(this.scopes);
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(scopes)
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .consent()
    .checkConnected();
});

When("l'usager ne peut pas se connecter à FranceConnect", function () {
  expect(this.env).to.exist;
  expect(this.serviceProvider).to.exist;
  expect(this.identityProvider).to.exist;
  expect(this.user).to.exist;
  new ConnectionWorkflow(this.env, this.serviceProvider)
    .init()
    .withScope(getDefaultScope(this.scopes))
    .start()
    .selectIdentityProvider(this.identityProvider)
    .login(this.user)
    .checkError();
});
