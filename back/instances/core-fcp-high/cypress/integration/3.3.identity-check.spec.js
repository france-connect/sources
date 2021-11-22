import {
  basicScenario,
  checkInStringifiedJson,
  getIdentityProvider,
  validateConsent,
} from './mire.utils';

const scopes = [
  'openid',
  'given_name',
  'family_name',
  'gender',
  'birthdate',
  'birthplace',
  'birthcountry',
  'email'
];

// -- replace by either `fip1-high` or `fia1-low`
const idpId = `${Cypress.env('IDP_NAME')}1-high`;

const idpInfo = getIdentityProvider(idpId);

describe('3.3 - Identity Check', () => {
  it('should failed when userInfos FC+ have missing claims returned from IdP FR', () => {
    // hack to ask missing scope
    const scopesWithoutEmail = scopes.filter((scope) => scope !== 'email');
    cy.registerProxyURL(`${idpInfo.IDP_ROOT_URL}/authorize?*`, {
      // email missing voluntary
      scope: scopesWithoutEmail.join(' '),
    });

    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      scopes,
      idpId,
    });

    cy.proxyURLWasActivated();

    cy.hasError('Y000006');
    cy.contains(`Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`);
    // only one error
    cy.contains(/(?:"constraints"){1}.*?(constraints)/).should('not.exist');
  });

  it('should success when userInfos FC+ have also an unknown claims from IdP FR', () => {
    cy.registerProxyURL(`${idpInfo.IDP_ROOT_URL}/authorize?*`, {
      scope: `${scopes.join(' ')} unknown_prop_for_test`,
    });

    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      scopes,
      idpId,
    });

    cy.proxyURLWasActivated();

    validateConsent();

    checkInStringifiedJson('unknown_prop_for_test_');
  });
});
