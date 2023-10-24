import { basicErrorScenario, basicScenario } from './mire.utils';

describe('4.0 - RNIPP', () => {
  const headingErrorMessage = "Une erreur s'est produite";

  beforeEach(() => {
    cy.clearBusinessLog();
  });

  it('should trigger error Y010004', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010004',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010004', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });

  it('should trigger error Y010006', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010006',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010006', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });

  it('should trigger error Y010007', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010007',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010007', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });

  it('should trigger error Y010008', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010008',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010008', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });

  it('should trigger error Y010009', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010009',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010009', headingErrorMessage);
  });

  it('should trigger error Y010011', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010011',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010011', headingErrorMessage);
  });

  it('should trigger error Y010012', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010012',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010012', headingErrorMessage);
  });

  it('should trigger error Y010013', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010013',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010013', headingErrorMessage);
  });

  it('should trigger error Y010013 if user has an invalid COG (AAAAA)', () => {
    basicScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
      userName: 'test_INVALID_COG',
    });

    cy.hasError('Y000006');
    cy.contains(
      `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous`,
    );
    // birthplace and address
    cy.contains(/(?:"constraints"){2}.*?(constraints)/).should('not.exist');
  });

  it('should trigger error Y010015', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010015',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010015', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_DECEASED_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });

  it('should trigger error Y010099', () => {
    basicErrorScenario({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      errorCode: 'E010099',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });

    cy.hasError('Y010013', headingErrorMessage);
    cy.hasBusinessLog({
      event: 'FC_RECEIVED_INVALID_RNIPP',
      idpId: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
    });
  });
});
