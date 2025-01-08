import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'le nombre de ligne est {int} dans le fichier csv {string}',
  function (rowsCount: number, fileName: string) {
    const records = this.csvFiles[fileName];
    expect(records).to.exist;
    expect(records.length).to.equal(rowsCount);
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
