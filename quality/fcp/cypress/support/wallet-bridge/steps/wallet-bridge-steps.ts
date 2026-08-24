import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { User } from '../../common/helpers';
import WalletBridgePage from '../pages/wallet-bridge-page';

const walletBridgePage = new WalletBridgePage();

const MOCK_WALLET_ID = 'mock-wallet';

function getIdentityIndex(user: User): number {
  const { username } = user.getCredentials(MOCK_WALLET_ID);

  return parseInt(username, 10);
}

function callMockWallet(
  mockWalletUrl: string,
  path: string,
  extraQs: Record<string, unknown> = {},
): void {
  cy.get<string>('@walletRequestUri').then((requestUri) => {
    cy.request({
      method: 'GET',
      qs: {
        deepLink: requestUri,
        flow: 'cross-device',
        ...extraQs,
      },
      url: `${mockWalletUrl}${path}`,
    }).then((response: unknown) => {
      const status = (response as { status?: number }).status;
      expect(status).to.eq(200);
    });
  });
}

Then(
  'je suis redirigé vers la page de connexion du Wallet Bridge',
  function () {
    walletBridgePage.checkIsVisible();
  },
);

Then('le QR code de connexion Wallet EUDI est affiché', function () {
  walletBridgePage.getQRCodeImage().should('be.visible');
});

Then(
  /^le bouton d'ouverture de l'application wallet (est|n'est pas) affiché$/,
  function (text: string) {
    const shouldBeVisible = text === 'est';
    if (shouldBeVisible) {
      walletBridgePage
        .getOpenWalletAppButton()
        .should('be.visible')
        .invoke('attr', 'href')
        .should('match', /^openid4vp:/);
    } else {
      walletBridgePage.getOpenWalletAppButton().should('not.be.visible');
    }
  },
);

Then(
  "le lien d'information Wallet EUDI redirige vers le site usagers",
  function () {
    walletBridgePage
      .getAboutLink()
      .should('be.visible')
      .should('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .should('contain', 'franceconnect.gouv.fr');
  },
);

When('je scan le QR code de connexion Wallet EUDI', function () {
  walletBridgePage.getRequestUri().as('walletRequestUri');
});

When("j'ouvre la demande d'authentification sur mon Wallet EUDI", function () {
  const identityIndex = getIdentityIndex(this.user);

  callMockWallet(this.env.mockWalletUrl, '/wallet/authorize', {
    identityIndex,
  });
});

When('je suspends la redirection automatique du Wallet Bridge', function () {
  // Freeze page timers so the success redirect (redirectDelay) cannot fire
  // while a screenshot is being taken
  cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
});

When("j'annule l'authentification depuis mon Wallet EUDI", function () {
  callMockWallet(this.env.mockWalletUrl, '/wallet/authorize-error-submit');
});

Then("le message d'authentification en cours est affiché", function () {
  walletBridgePage.getPendingStatusMessage().should('be.visible');
});

Then("le message d'authentification réussie est affiché", function () {
  walletBridgePage.getSuccessStatusMessage().should('be.visible');
});

Then("le message d'échec de connexion est affiché", function () {
  walletBridgePage.getErrorStatusMessage().should('be.visible');
});

When("je m'authentifie sur mon Wallet EUDI", function () {
  const identityIndex = getIdentityIndex(this.user);

  callMockWallet(this.env.mockWalletUrl, '/wallet/authorize-submit', {
    identityIndex,
  });
});
