import { basicErrorScenario, basicScenario } from './mire.utils';

describe('4.0 - RNIPP', () => {
  beforeEach(() => {
    cy.clearBusinessLog();
  });

  it('should trigger error Y010004', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010004',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010004');
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'fip1-high',
    });
  });

  it('should trigger error Y010006', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010006',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010006');
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'fip1-high',
    });
  });

  it('should trigger error Y010007', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010007',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010007');
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'fip1-high',
    });
  });

  it('should trigger error Y010008', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010008',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010008');
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'fip1-high',
    });
  });

  it('should trigger error Y010009', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010009',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010009');
  });

  it('should trigger error Y010011', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010011',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010011');
  });

  it('should trigger error Y010012', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010012',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010012');
  });

  it('should trigger error Y010013', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010013',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010013');
  });

  it('should trigger error Y010013 if user has an invalid COG (AAAAA)', () => {
    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId: 'fip1-high',
      userName: 'test_INVALID_COG',
    });

    cy.hasError('Y000006');
    cy.contains(`Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`);
    // birthplace and address
    cy.contains(/(?:"constraints"){2}.*?(constraints)/).should('not.exist');
  });

  it('should trigger error Y010015', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010015',
      idpId: 'fip1-high',
    });

    cy.hasError('Y010015');
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_DECEASED_RNIPP',
      idpId: 'fip1-high',
    });
  });
});
