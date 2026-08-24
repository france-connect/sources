import { parseFile } from '@fast-csv/parse';
import * as recursive from 'recursive-readdir';

import { WalletPidCsvDto } from '../dto';
import { listCsvFiles, parseCsvFile } from './csv.helper';

jest.mock('recursive-readdir', () => jest.fn());
jest.mock('@fast-csv/parse', () => ({ parseFile: jest.fn() }));

describe('csv.helper', () => {
  const recursiveMock = recursive as unknown as jest.Mock;
  const parseFileMock = jest.mocked(parseFile);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('listCsvFiles', () => {
    it('should list csv files ignoring non-csv entries', async () => {
      // Given
      recursiveMock.mockResolvedValue(['/data/pid.csv']);

      // When
      const result = await listCsvFiles('/data');

      // Then
      expect(result).toEqual(['/data/pid.csv']);
      expect(recursiveMock).toHaveBeenCalledExactlyOnceWith('/data', [
        '!*.csv',
      ]);
    });
  });

  describe('parseCsvFile', () => {
    function fakeStream(rows: unknown[], error?: Error) {
      const handlers: Record<string, (arg?: unknown) => void> = {};
      const stream = {
        on(event: string, callback: (arg?: unknown) => void) {
          handlers[event] = callback;
          return stream;
        },
      };

      setImmediate(() => {
        if (error) {
          handlers.error(error);
          return;
        }
        rows.forEach((row) => handlers.data(row));
        handlers.end();
      });

      return stream;
    }

    it('should resolve with the parsed rows', async () => {
      // Given
      const rows = [{ family_name: 'DUPONT', given_name: 'JEAN' }];
      parseFileMock.mockReturnValue(fakeStream(rows) as never);

      // When
      const result = await parseCsvFile('/data/pid.csv', WalletPidCsvDto);

      // Then
      expect(result[0]).toBeInstanceOf(WalletPidCsvDto);
      expect(result[0]).toMatchObject({
        family_name: 'DUPONT',
        given_name: 'JEAN',
      });
    });

    it('should split pipe-separated nationalities into an array', async () => {
      // Given
      const rows = [{ family_name: 'DUPONT', nationality: 'FR|DE|IT' }];
      parseFileMock.mockReturnValue(fakeStream(rows) as never);

      // When
      const result = await parseCsvFile('/data/pid.csv', WalletPidCsvDto);

      // Then
      expect(result[0].nationality).toEqual(['FR', 'DE', 'IT']);
    });

    it('should wrap a single nationality into a one-element array', async () => {
      // Given
      const rows = [{ family_name: 'DUPONT', nationality: 'FR' }];
      parseFileMock.mockReturnValue(fakeStream(rows) as never);

      // When
      const result = await parseCsvFile('/data/pid.csv', WalletPidCsvDto);

      // Then
      expect(result[0].nationality).toEqual(['FR']);
    });

    it('should cast integer fields to numbers', async () => {
      // Given
      const rows = [{ age_in_years: '42', age_birth_year: '1982', sex: '1' }];
      parseFileMock.mockReturnValue(fakeStream(rows) as never);

      // When
      const result = await parseCsvFile('/data/pid.csv', WalletPidCsvDto);

      // Then
      expect(result[0].age_in_years).toBe(42);
      expect(result[0].age_birth_year).toBe(1982);
      expect(result[0].sex).toBe(1);
    });

    it('should cast age_over_18 to boolean', async () => {
      // Given
      const rows = [{ age_over_18: 'true' }];
      parseFileMock.mockReturnValue(fakeStream(rows) as never);

      // When
      const result = await parseCsvFile('/data/pid.csv', WalletPidCsvDto);

      // Then
      expect(result[0].age_over_18).toBe(true);
    });

    it('should reject when the stream errors', async () => {
      // Given
      parseFileMock.mockReturnValue(
        fakeStream([], new Error('parse error')) as never,
      );

      // When / Then
      await expect(
        parseCsvFile('/data/pid.csv', WalletPidCsvDto),
      ).rejects.toThrow('parse error');
    });
  });
});
