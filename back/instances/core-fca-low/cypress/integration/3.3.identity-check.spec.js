import {
  basicScenario,
  checkInStringifiedJson,
  getIdentityProvider,
} from './mire.utils';

const scopes = 'openid given_name usual_name uid email';

// -- replace by either `fip1-high` or `fia1-low`
const idpId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

describe('Identity Check', () => {
  it('should failed when userInfos AgentConnect have missing claims returned from IdP', () => {
    // hack to ask missing scope
    const { IDP_ROOT_URL } = getIdentityProvider();
    cy.registerProxyURL(`${IDP_ROOT_URL}/authorize?*`, {
      // email missing voluntary
      scope: scopes.replace('email', ''),
    });

    basicScenario({
      idpId,
    });

    cy.proxyURLWasActivated();

    cy.hasError('Y000006');
    cy.contains(`Une erreur est survenue`);
    // only one error
    cy.contains(/(?:"constraints"){1}.*?(constraints)/).should('not.exist');
  });

  it('should success when userInfos AgentConnect have also an unknown claims from IdP', () => {
    const { IDP_ROOT_URL } = getIdentityProvider();
    cy.registerProxyURL(`${IDP_ROOT_URL}/authorize?*`, {
      scope: `${scopes} unknown_prop_for_test`,
    });

    basicScenario({
      userName: 'E020025',
      idpId,
    });

    cy.proxyURLWasActivated();

    checkInStringifiedJson('unknown_prop_for_test');
  });
});
