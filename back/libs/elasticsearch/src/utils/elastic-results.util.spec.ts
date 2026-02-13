import {
  ElasticReindexTaskResponse,
  ElasticTransformStatsEntry,
} from '../interfaces';
import {
  getTransformDocIndexed,
  getTransformLastCheckpoint,
  mapReindexFailures,
} from './elastic-results.util';

describe('getTransformLastCheckpoint', () => {
  it('should return the checkpoint number when all properties exist', () => {
    // Given
    const transform: ElasticTransformStatsEntry = {
      checkpointing: {
        last: {
          checkpoint: 123,
        },
      },
    } as ElasticTransformStatsEntry;

    // When
    const result = getTransformLastCheckpoint(transform);

    // Then
    expect(result).toBe(123);
  });

  it('should return undefined if checkpointing is missing', () => {
    // Given
    const transform = {} as ElasticTransformStatsEntry;

    // When
    const result = getTransformLastCheckpoint(transform);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined if last is missing', () => {
    // Given
    const transform = {
      checkpointing: {},
    } as ElasticTransformStatsEntry;

    // When
    const result = getTransformLastCheckpoint(transform);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined if checkpoint is missing', () => {
    // Given
    const transform = {
      checkpointing: {
        last: {},
      },
    } as ElasticTransformStatsEntry;

    // When
    const result = getTransformLastCheckpoint(transform);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined if the transform object is undefined', () => {
    // When
    const result = getTransformLastCheckpoint(undefined);

    // Then
    expect(result).toBeUndefined();
  });
});

describe('getTransformDocIndexed', () => {
  it('should return the documents_indexed number when all properties exist', () => {
    // Given
    const transform = {
      stats: {
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        documents_indexed: 456,
      },
    } as ElasticTransformStatsEntry;

    // When
    const result = getTransformDocIndexed(transform);

    // Then
    expect(result).toBe(456);
  });

  it('should return undefined if stats is missing', () => {
    // Given
    const transform = {} as ElasticTransformStatsEntry;

    // When
    const result = getTransformDocIndexed(transform);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined if documents_indexed is missing', () => {
    // Given
    const transform = {
      stats: {},
    } as ElasticTransformStatsEntry;

    // When
    const result = getTransformDocIndexed(transform);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined if the transform object is undefined', () => {
    // When
    const result = getTransformDocIndexed(undefined);

    // Then
    expect(result).toBeUndefined();
  });
});

describe('mapReindexFailures', () => {
  it('should return an empty array if there are no failures', () => {
    // Given
    const response: ElasticReindexTaskResponse = {};

    // When
    const result = mapReindexFailures(response);

    // Then
    expect(result).toEqual([]);
  });

  it('should return an empty array if failures is an empty array', () => {
    // Given
    const response: ElasticReindexTaskResponse = {
      failures: [],
    };

    // When
    const result = mapReindexFailures(response);

    // Then
    expect(result).toEqual([]);
  });

  it('should map failures correctly', () => {
    // Given
    const response: ElasticReindexTaskResponse = {
      failures: [
        {
          id: '1',
          cause: { reason: 'Reason 1' },
        },
        {
          id: '2',
          cause: { reason: 'Reason 2' },
        },
      ],
    };

    // When
    const result = mapReindexFailures(response);

    // Then
    expect(result).toEqual([
      { id: '1', reason: 'Reason 1' },
      { id: '2', reason: 'Reason 2' },
    ]);
  });
});
