import { createReadStream } from 'fs';

import { createCSV, readCSV } from './csv.helper';

jest.mock('fs');
jest.mock('csv-parser');

describe('readCSV', () => {
  const createReadStreamMock = jest.mocked(createReadStream);

  it('should read the CSV file and resolve with results', async () => {
    const csvFilePath = '../fixture/test.csv';
    const expectedResult = [{ col1: 'value1', col2: 'value2' }];
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback({ col1: 'value1', col2: 'value2' }); // Mock des données
        } else if (event === 'end') {
          callback();
        } else if (event === 'error') {
          callback(new Error('Mocked error'));
        }
        return mockReadStream;
      }),
    };

    createReadStreamMock.mockReturnValue(mockReadStream);

    const result = await readCSV(csvFilePath);
    expect(result).toEqual(expectedResult);
  });

  it('should reject with an error if the CSV file reading fails', async () => {
    const csvFilePath = '../fixure/nonexistent.csv';
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'error') {
          callback(new Error('Mocked error'));
        }
        return mockReadStream;
      }),
    };

    createReadStreamMock.mockReturnValue(mockReadStream);

    await expect(readCSV(csvFilePath)).rejects.toThrowError('Mocked error');
  });
});

describe('createCSV', () => {
  it('should create a valid CSV content from an array of objects', () => {
    const data = [
      { col1: 'value1', col2: 'value2' },
      { col1: 'value3', col2: 'value4' },
    ];

    const expectedCSVContent = 'col1,col2\nvalue1,value2\nvalue3,value4';
    const csvContent = createCSV(data);

    expect(csvContent).toEqual(expectedCSVContent);
  });
});
