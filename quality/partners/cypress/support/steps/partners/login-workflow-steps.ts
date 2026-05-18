import { Given, Step, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  navigateTo,
  waitForConnectionStatus,
  waitForContentRendering,
} from '../../helpers';
import LoginPage from '../../pages/login-page';
import OidcProviderPage from '../../pages/oidc-provider-page';
import TopMenuComponent from '../../pages/top-menu-component';
import { Environment, UserData } from '../../types';

const loginPage = new LoginPage();
const oidcProviderPage = new OidcProviderPage();
const topMenuComponent = new TopMenuComponent();

class ConnectionWorkflow {
  /**
   * Login to partners website via an Oidc Provider
   * @returns the current ConnectionWorkflow instance
   */
  login(
    env: Environment,
    user: UserData,
    acr = 'eidas1',
    withCustomIdentity = false,
  ): this {
    const { email } = user.claims;
    const { allAppsUrl, partnersRootUrl } = env;
    cy.session(
      [email, acr],
      () => {
        navigateTo({ appId: 'partners', baseUrl: allAppsUrl });
        loginPage.getLoginButton().click();
        oidcProviderPage.login(user, acr, withCustomIdentity);
      },
      {
        cacheAcrossSpecs: true,
        validate() {
          topMenuComponent.checkIsConnected(partnersRootUrl);
        },
      },
    );
    navigateTo({ appId: 'partners', baseUrl: allAppsUrl });
    waitForConnectionStatus();
    waitForContentRendering();
    return this;
  }

  /**
   * Logout to partners website
   * @returns the current ConnectionWorkflow instance
   */
  logout(): this {
    topMenuComponent.getLogoutLink().click();
    waitForConnectionStatus();
    waitForContentRendering();
    return this;
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkIsConnected(partnersRootUrl: string, isConnected: boolean): void {
    topMenuComponent.checkIsConnected(partnersRootUrl, isConnected);
  }
}

When(
  /^je me connecte à l'espace partenaires( avec une identité personnalisée)?$/,
  function (withCustomIdentity?: string) {
    expect(this.user).to.exist;

    new ConnectionWorkflow()
      .login(this.env, this.user, 'eidas1', !!withCustomIdentity)
      .checkIsConnected(this.env.partnersRootUrl, true);
  },
);

When(
  "je me connecte à l'espace partenaires avec un acr {string}",
  function (acr: string) {
    expect(this.user).to.exist;

    new ConnectionWorkflow()
      .login(this.env, this.user, acr)
      .checkIsConnected(this.env.partnersRootUrl, true);
  },
);

Given(
  "je me connecte à l'espace partenaires avec un utilisateur {string}",
  function (description: string) {
    // See nested steps: https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/cucumber-basics.md#nested-steps
    Step(this, `je suis un utilisateur "${description}"`);
    Step(this, "je me connecte à l'espace partenaires");
  },
);

When("je me déconnecte de l'espace partenaires", function () {
  expect(this.user).to.exist;
  const { partnersRootUrl } = this.env;
  new ConnectionWorkflow().logout().checkIsConnected(partnersRootUrl, false);
});
