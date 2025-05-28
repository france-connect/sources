import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'le nombre de ligne est {int} dans le fichier csv {string}',
  function (rowsCount: number, fileName: string) {
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    expect(records.length).to.equal(rowsCount);
  },
);

Then(
  'le fichier csv {string} contient {int} colonnes',
  function (fileName: string, length: number) {
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    expect(records.length).to.be.greaterThan(0);
    const headers = Object.keys(records[0]);
    expect(headers).to.have.length(length);
  },
);

Then(
  'le fichier csv {string} contient les colonnes {string}',
  function (fileName: string, columns: string) {
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    expect(records.length).to.be.greaterThan(0);
    const headers = Object.keys(records[0]);
    const expectedColumns = columns.split(',');

    expectedColumns.forEach((columnName) =>
      expect(headers).to.include(columnName),
    );
  },
);

Then(
  '{string} est {string} pour la ligne {int} du fichier csv {string}',
  function (
    columnName: string,
    value: string,
    rowIndex: number,
    fileName: string,
  ) {
    const index = rowIndex - 1;
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    const record = records[index];
    expect(record[columnName]).to.equal(value);
  },
);

Then(
  '{string} contient {int} caractères pour la ligne {int} du fichier csv {string}',
  function (
    columnName: string,
    length: number,
    rowIndex: number,
    fileName: string,
  ) {
    const index = rowIndex - 1;
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    const record = records[index];
    expect(record[columnName]).to.have.length(length);
  },
);

Then(
  'je vérifie le contenu du fichier csv {string}',
  function (fileName: string, dataTable?: DataTable) {
    const records = this.csvFiles[fileName];
    expect(records).to.be.ok;
    const expectedRecords = dataTable?.hashes() || [];
    expectedRecords.forEach((row, index) => {
      cy.log(`Check row ${index}`);
      Object.entries(row).forEach(([key, value]) => {
        if (value.includes('.*')) {
          const regexp = new RegExp(value);
          cy.wrap(records[index]).its(key).should('match', regexp);
        } else {
          cy.wrap(records[index]).its(key).should('equal', value);
        }
      });
    });
  },
);
