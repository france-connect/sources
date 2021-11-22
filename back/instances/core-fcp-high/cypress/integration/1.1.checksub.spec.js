import {
  basicSuccessScenario,
  checkInformationsServiceProvider,
  checkInStringifiedJson,
} from './mire.utils';

describe('1.1 - Successful Sub checks', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  it('should check the correct sub for Thibault TABLE', () => {
    basicSuccessScenario({
      userName: 'test_THIBAULT',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
    });

    checkInformationsServiceProvider({
      gender: 'Homme',
      givenName: 'THIBAULT',
      familyName: 'TABLE',
      birthdate: '1991-02-13',
      birthplace: '75116',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      'f9fd1bd7ce52ecc11d2e7cda0db878d88bce47fd096d416b87137c90298bbcc1v1',
    );
  });
  it('should check the correct sub for Mélanie DUPLANTY (Désactivé)', () => {
    basicSuccessScenario({
      userName: 'Désactivé',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
    });

    checkInformationsServiceProvider({
      gender: 'Femme',
      givenName: 'Mélodie',
      familyName: 'DUPLANTY',
      birthdate: '1962-08-24',
      birthplace: '75107',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      '67335a043d37db124bb9d665991344072c93860e349b29c170d7779295a761efv1',
    );
  });

  it('should check the correct sub for Joëlle Françoise DUBINÔRE (caractères spéciaux)', () => {
    basicSuccessScenario({
      userName: 'caractères_spéciaux',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId,
    });

    checkInformationsServiceProvider({
      gender: 'Femme',
      givenName: 'Joëlle Françoise',
      familyName: 'DUBINÔRE',
      birthdate: '1992-08-15',
      birthplace: '75117',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      '34f4e38b510841db1a83716b981f7298badec51dc52e91af245903b56e2d72bbv1',
    );
  });
});
