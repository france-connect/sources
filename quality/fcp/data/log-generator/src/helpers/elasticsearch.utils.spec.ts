import { Client } from '@elastic/elasticsearch';
import { DateTime } from 'luxon';

import { HelpTracerFalseLogs } from '../enums';
import { BuildEventLogs, EsQueryInterface, LogsInterface } from '../interfaces';
import { ESHelper } from './elasticsearch.utils';
import { hasNoError } from './has-no-error';
import { debug } from './log';
import { safelyParseJson } from './safely-parse-json';

jest.mock('@elastic/elasticsearch');
jest.mock('./has-no-error', () => ({
  hasNoError: jest.fn(),
}));
jest.mock('./log');
jest.mock('./safely-parse-json');

describe('ESHelper', () => {
  const esNodes = '["http://localhost:9200"]';
  const username = 'user';
  const password = 'pass';
  let esHelper: ESHelper;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(safelyParseJson).mockReturnValue(['http://localhost:9200']);
    esHelper = new ESHelper(esNodes, username, password);
  });

  describe('constructor', () => {
    it('should initialize the Elasticsearch client with correct parameters', () => {
      // Given
      expect(safelyParseJson).toHaveBeenCalledWith(esNodes);

      // When / Then
      expect(esHelper.esClient).toBeInstanceOf(Client);
    });

    it('should throw an error if nodes are not valid', () => {
      // Given
      jest.mocked(safelyParseJson).mockReturnValue([]);

      // When / Then
      expect(() => new ESHelper(esNodes, username, password)).toThrow(
        'Problem with connection params: []',
      );
    });

    it('should throw an error if safelyParseJson throws an error', () => {
      // Given
      jest.mocked(safelyParseJson).mockImplementation(() => {
        throw new Error('Invalid JSON');
      });

      // When / Then
      expect(() => new ESHelper(esNodes, username, password)).toThrow(
        'Problem with connection nodes params: Error: Invalid JSON',
      );
    });
  });

  describe('buildQuery', () => {
    it('should build a query with the correct index and parameters', () => {
      // Given
      const index = 'test-index';
      const expected = {
        body: {
          query: {
            match: { '@version': HelpTracerFalseLogs.TRACE_MARK },
          },
        },
        index,
        refresh: true,
        size: 2000,
      };

      // When
      const query = esHelper.buildQuery(index);

      // Then
      expect(query).toEqual(expected);
    });
  });

  describe('save', () => {
    it('should save documents to Elasticsearch', async () => {
      // Given
      const mocks = [
        { accountId: '123', time: '2021-01-01T00:00:00Z' },
      ] as unknown as LogsInterface[];
      const index = 'test-index';
      const mockResult = {
        body: { errors: false, items: [] },
      };
      jest
        .spyOn(esHelper.esClient, 'bulk')
        .mockResolvedValue(mockResult as never);
      jest.mocked(hasNoError).mockReturnValue(true);

      // When
      await esHelper.save(mocks, index);

      // Then
      expect(hasNoError).toHaveBeenCalledTimes(1);
      expect(esHelper.esClient.bulk).toHaveBeenCalledWith({
        body: [
          { index: { _index: index, _type: '_doc' } },
          { accountId: '123', time: '2021-01-01T00:00:00Z' },
        ],
        pipeline: 'geo',
        refresh: true,
      });
    });
  });

  describe('deleteByQuery', () => {
    it('should delete documents by query', async () => {
      // Given
      const query: EsQueryInterface = {
        body: {
          query: {
            match: { '@version': HelpTracerFalseLogs.TRACE_MARK },
          },
        },
        index: 'test-index',
        refresh: true,
        size: 2000,
      };

      (esHelper.esClient.deleteByQuery as jest.Mock).mockResolvedValue({
        body: { deleted: 10, failures: [] },
      });

      // When
      await esHelper.deleteByQuery(query);

      // Then
      expect(esHelper.esClient.deleteByQuery).toHaveBeenCalledWith(query);
      expect(debug).toHaveBeenCalledWith('10 document(s) were deleting...');
    });

    it('should throw an error if there are failures', async () => {
      // Given
      const query: EsQueryInterface = {
        body: {
          query: {
            match: { '@version': HelpTracerFalseLogs.TRACE_MARK },
          },
        },
        index: 'test-index',
        refresh: true,
        size: 2000,
      };

      const mockResult = {
        body: { deleted: 10, failures: [{ id: '1' }] },
      };
      jest
        .spyOn(esHelper.esClient, 'deleteByQuery')
        .mockResolvedValue(mockResult as never);

      // When / Then
      await expect(esHelper.deleteByQuery(query)).rejects.toThrow(
        'Deleting old mocks failed, still have 1 docs',
      );
    });
  });

  describe('createDocument', () => {
    const mockDate = DateTime.fromISO('2021-01-01T00:00:00Z');
    it('should create and save documents in legacy format when typeAction is present', async () => {
      // Given
      const buildEventLogs = {
        accountId: '123',
        data: { foo: 'bar' },
        dates: [mockDate],
        esIndex: 'test-index',
        event: 'event',
        typeAction: 'type',
      } as unknown as BuildEventLogs;

      jest.spyOn(esHelper, 'save').mockResolvedValue(true);

      // When
      const result = await esHelper.createDocument(buildEventLogs);

      // Then
      expect(result).toBe(true);
      expect(esHelper.save).toHaveBeenCalledWith(
        [
          {
            accountId: '123',
            action: 'event',
            foo: 'bar',
            time: mockDate.toISO(),
            type_action: 'type',
          },
        ],
        'test-index',
      );
    });

    it('should create and save documents in core v2 format when typeAction is absent', async () => {
      // Given
      const buildEventLogs = {
        accountId: '123',
        data: { foo: 'bar' },
        dates: [mockDate],
        esIndex: 'test-index',
        event: 'event',
        typeAction: null,
      } as unknown as BuildEventLogs;

      jest.spyOn(esHelper, 'save').mockResolvedValue(true);

      // When
      const result = await esHelper.createDocument(buildEventLogs);

      // Then
      expect(result).toBe(true);
      expect(esHelper.save).toHaveBeenCalledWith(
        [
          {
            accountId: '123',
            event: 'event',
            foo: 'bar',
            time: mockDate.toMillis(),
          },
        ],
        'test-index',
      );
    });
  });
});
