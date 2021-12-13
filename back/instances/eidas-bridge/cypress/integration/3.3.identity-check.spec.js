import {
  authenticateToEUIdp,
  authenticateToIdp,
  basicSuccessScenarioEuSpFrIdp,
  basicSuccessScenarioFrSpEuIdp,
  checkInformationsEuSpFrIdp,
  checkInformationsFrSpEuIdp,
  chooseIdp,
  configureEidasSpMockRequest,
  configureOidcSpMockRequest,
} from './mire.utils';

const SCOPES_FR =
  'openid given_name family_name gender birthdate birthplace birthcountry email';
const SCOPES_EIDAS = 'openid given_name family_name birthdate';

const SCOPES_FULL =
  'openid profile email preferred_username birthplace birthcountry';

describe('Identity Check', () => {
  describe('Sp from EU to idp from FR >', () => {
    const baseUrl = Cypress.env('IDP_ROOT_URL').replace(
      'IDP_NAME',
      `${Cypress.env('IDP_NAME')}1-high`,
    );

    it('should failed when userInfos FC+ have missing claims returned from IdP FR', () => {
      // hack to ask missing scope

      cy.registerProxyURL(`${baseUrl}/authorize?*`, {
        // email missing voluntary
        scope: SCOPES_FR.replace('email', ''),
      });

      const params = {
        idpId: `${Cypress.env('IDP_NAME')}1-high`,
      };

      configureEidasSpMockRequest();
      chooseIdp(params);
      authenticateToIdp(params);

      cy.proxyURLWasActivated();

      cy.hasError('Y000006');
      cy.contains(
        `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
      );
      // only one error
      cy.contains(/(?:"constraints"){1}.*?(constraints)/).should('not.exist');
    });

    it('should success when userInfos FC+ have also an unknown claims from IdP FR', () => {
      cy.registerProxyURL(`${baseUrl}/authorize?*`, {
        scope: `${SCOPES_FULL} unknown_prop_for_test`,
      });

      basicSuccessScenarioEuSpFrIdp({
        logWith: {
          idpId: `${Cypress.env('IDP_NAME')}1-high`,
          login: 'E020025',
        },
      });

      cy.proxyURLWasActivated();

      const expectedIdentity = [
        { name: 'BirthName', value: '[Martin]' },
        { name: 'FamilyName', value: '[Martin]' },
        { name: 'FirstName', value: '[Jean_E020025]' },
        { name: 'DateOfBirth', value: '[1981-02-03]' },
        { name: 'Gender', value: '[Male]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/UK/df407c66a82320d66cadd2b8e4c475e48c7f8bd04c71a8355280975e8d0a4839v1]',
        },
        {
          name: 'PlaceOfBirth',
          value: '[Paris 12e Arrondissement - 75112, FRANCE (FR)]',
        },
      ];
      checkInformationsEuSpFrIdp({ expectedIdentity });

      cy.get('.table-responsive > table.table.table-striped')
        .contains('unknown_prop_for_test')
        .should('not.exist');
    });
  });

  describe('Sp from FR to idp from EU >', () => {
    const baseUrl = Cypress.env('BRIDGE_ROOT_URL');

    it('should failed when userInfos FC+ have missing claims returned from IdP EU', () => {
      cy.registerProxyURL(`${baseUrl}/authorize?*`, {
        scope: SCOPES_EIDAS.replace('family_name', ''),
      });

      // start with Sp FR
      configureOidcSpMockRequest();
      // login on EU idp
      authenticateToEUIdp({ optionalAttributes: false });

      cy.hasError('Y000006');
      cy.contains(
        `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
      );
      // only one error
      cy.contains(/(?:"constraints"){1}.*?(constraints)/).should('not.exist');
    });

    it('should success when userInfos FC+ have also an unknown claims from IdP EU', () => {
      cy.registerProxyURL(`${baseUrl}/authorize?*`, {
        scope: `${SCOPES_FULL} unknown_prop_for_test`,
      });

      basicSuccessScenarioFrSpEuIdp();

      checkInformationsFrSpEuIdp();
    });
  });
});
